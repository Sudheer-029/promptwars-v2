import os
import logging
import httpx
from contextlib import asynccontextmanager
from functools import lru_cache
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from google import genai

load_dotenv()

# ---------------------------------------------------------------------------
# Google Cloud Logging -- structured logs visible in Cloud Console.
# Gracefully falls back to stdlib logging for local development.
# ---------------------------------------------------------------------------
try:
    import google.cloud.logging as cloud_logging
    _log_client = cloud_logging.Client()
    _log_client.setup_logging()
except Exception:
    pass  # local dev without ADC

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Gemini client -- lazily initialised so credentials are ready before use.
# Set GEMINI_API_KEY to use Google AI Studio (recommended).
# Without it, falls back to Vertex AI via Application Default Credentials.
# ---------------------------------------------------------------------------
GCP_PROJECT = os.environ.get("GCP_PROJECT", "")
GCP_LOCATION = os.environ.get("GCP_LOCATION", "us-central1")
_client: genai.Client | None = None

# Reusable async HTTP client -- connection pooling, keep-alive
_http_client: httpx.AsyncClient | None = None


def get_client() -> genai.Client:
    """Return (or lazily create) the Gemini API client."""
    global _client
    if _client is None:
        api_key = os.environ.get("GEMINI_API_KEY", "").strip()
        if api_key:
            _client = genai.Client(api_key=api_key)
        else:
            if not GCP_PROJECT:
                raise RuntimeError("Set GEMINI_API_KEY or GCP_PROJECT environment variable.")
            _client = genai.Client(vertexai=True, project=GCP_PROJECT, location=GCP_LOCATION)
    return _client


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application lifecycle: initialise and cleanly close shared resources."""
    global _http_client
    get_client()
    _http_client = httpx.AsyncClient(
        timeout=httpx.Timeout(10.0),
        headers={"User-Agent": "ElectaGuide/1.0"},
        limits=httpx.Limits(max_keepalive_connections=10, max_connections=20),
    )
    logger.info("ElectaGuide startup complete")
    yield
    await _http_client.aclose()


limiter = Limiter(key_func=get_remote_address)
app = FastAPI(
    title="ElectaGuide India API",
    description="AI-powered voter assistance for India — Chunav Mitra chatbot and Booth Finder.",
    version="1.0.0",
    lifespan=lifespan,
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# GZip compresses responses > 1 KB -- reduces bandwidth on mobile networks
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ordered by preference -- first model with available quota wins
STUDIO_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"]
VERTEX_MODELS = ["gemini-2.5-flash-preview-05-20", "gemini-2.0-flash-001"]


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class ChatRequest(BaseModel):
    """Incoming chat query payload."""
    query: str = Field(..., min_length=1, max_length=500, description="Voter question in any language")


class ChatResponse(BaseModel):
    """Structured chat response."""
    answer: str = Field(..., description="AI-generated answer from Chunav Mitra")
    model: str = Field(..., description="Gemini model that served the response")


class BoothResponse(BaseModel):
    """Post office / booth lookup response."""
    status: str = Field(..., description="'success' or 'error'")
    offices: list[dict] | None = Field(default=None, description="List of post offices for the pincode")
    message: str | None = Field(default=None, description="Error message when status is 'error'")


# ---------------------------------------------------------------------------
# In-memory pincode cache -- pincode -> post office data rarely changes.
# Cache up to 512 pincodes; avoids redundant outbound API calls.
# ---------------------------------------------------------------------------
_pincode_cache: dict[str, BoothResponse] = {}
MAX_CACHE_SIZE = 512


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/api/healthz", tags=["ops"])
async def health() -> dict:
    """Liveness probe used by Cloud Run health checks."""
    return {"status": "ok"}


@app.post("/api/chat", response_model=ChatResponse, tags=["chat"])
@limiter.limit("10/minute")
async def chat_with_ellie(request: Request, req: ChatRequest) -> ChatResponse:
    """
    Ask Chunav Mitra a question about Indian elections.

    Supports any language. Rate-limited to 10 requests/minute per IP.
    Tries multiple Gemini models in order; falls back on quota errors.
    """
    client = get_client()
    is_vertex = os.environ.get("GEMINI_API_KEY", "").strip() == ""
    models = VERTEX_MODELS if is_vertex else STUDIO_MODELS

    system_instruction = (
        "You are Chunav Mitra (Election Friend), an unbiased, helpful, and concise assistant "
        "for the Election Commission of India. Educate voters about election process, voting rights, "
        "and procedures in India. Do not endorse parties. Keep answers short and encouraging."
    )
    prompt = f"{system_instruction} User Question: {req.query} Answer:"
    last_error: str | None = None

    logger.info("chat request", extra={"json_fields": {"query_length": len(req.query)}})

    for model in models:
        try:
            response = client.models.generate_content(model=model, contents=prompt)
            logger.info("chat response", extra={"json_fields": {"model": model}})
            return ChatResponse(answer=response.text, model=model)
        except Exception as exc:
            err_str = str(exc)
            last_error = err_str
            if "404" not in err_str and "not found" not in err_str.lower():
                raise HTTPException(status_code=500, detail=err_str)

    raise HTTPException(
        status_code=503,
        detail=f"No Gemini model available. Last error: {last_error}",
    )


@app.get("/api/booth/{pincode}", response_model=BoothResponse, tags=["booth"])
async def get_booth_details(pincode: str) -> BoothResponse:
    """
    Look up post offices and polling area details for an Indian pincode.

    Args:
        pincode: Exactly 6 numeric digits.

    Returns:
        List of post offices or an error message.
    """
    if not pincode.isdigit() or len(pincode) != 6:
        raise HTTPException(status_code=400, detail="Invalid pincode. Must be exactly 6 digits.")

    # Serve from cache if available
    if pincode in _pincode_cache:
        logger.info("booth cache hit", extra={"json_fields": {"pincode": pincode}})
        return _pincode_cache[pincode]

    try:
        url = f"https://api.postalpincode.in/pincode/{pincode}"
        resp = await _http_client.get(url)
        data = resp.json()

        logger.info("booth lookup", extra={"json_fields": {"pincode": pincode, "status": resp.status_code}})

        if data and isinstance(data, list) and data[0].get("Status") == "Success":
            result = BoothResponse(status="success", offices=data[0].get("PostOffice", []))
        else:
            result = BoothResponse(status="error", message="No booth found for this pincode.")

        # Cache successful lookups only
        if result.status == "success" and len(_pincode_cache) < MAX_CACHE_SIZE:
            _pincode_cache[pincode] = result

        return result

    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Error fetching postal data: {exc}")


# Serve React SPA -- mounted LAST so API routes above take priority
if os.path.isdir("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8080)), reload=False)
