import os
import logging
import requests as req_lib
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
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
    pass  # local dev without ADC -- stdlib logging still works

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Gemini client -- lazily initialised so credentials are ready before use.
# Set GEMINI_API_KEY to use Google AI Studio (recommended).
# Without it, falls back to Vertex AI via Application Default Credentials.
# ---------------------------------------------------------------------------
GCP_PROJECT = os.environ.get("GCP_PROJECT", "")
GCP_LOCATION = os.environ.get("GCP_LOCATION", "us-central1")
_client = None


def get_client() -> genai.Client:
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
    get_client()
    logger.info("ElectaGuide startup complete")
    yield


limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="ElectaGuide India Backend", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ordered by preference -- first model with available quota wins
STUDIO_MODELS = ["gemini-2.5-flash", "gemini-3-flash"]
VERTEX_MODELS = ["gemini-2.5-flash-preview-05-20", "gemini-2.0-flash-001"]


class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)


@app.get("/api/healthz")
async def health():
    return {"status": "ok"}


@app.post("/api/chat")
@limiter.limit("10/minute")
async def chat_with_ellie(request: Request, req: ChatRequest):
    client = get_client()
    is_vertex = os.environ.get("GEMINI_API_KEY", "").strip() == ""
    models = VERTEX_MODELS if is_vertex else STUDIO_MODELS

    system_instruction = (
        "You are Chunav Mitra (Election Friend), an unbiased, helpful, and concise assistant "
        "for the Election Commission of India. Educate voters about election process, voting rights, "
        "and procedures in India. Do not endorse parties. Keep answers short and encouraging."
    )
    prompt = system_instruction + " User Question: " + req.query + " Answer:"
    last_error = None

    logger.info("chat request received", extra={"json_fields": {"query_length": len(req.query)}})

    for model in models:
        try:
            response = client.models.generate_content(model=model, contents=prompt)
            logger.info("chat response sent", extra={"json_fields": {"model": model}})
            return {"answer": response.text, "model": model}
        except Exception as e:
            err_str = str(e)
            last_error = err_str
            if "404" not in err_str and "not found" not in err_str.lower():
                raise HTTPException(status_code=500, detail=err_str)

    raise HTTPException(
        status_code=503,
        detail="No Gemini model available. Last error: " + str(last_error),
    )


@app.get("/api/booth/{pincode}")
async def get_booth_details(pincode: str):
    if not pincode.isdigit() or len(pincode) != 6:
        raise HTTPException(status_code=400, detail="Invalid pincode. Must be exactly 6 digits.")
    try:
        url = "https://api.postalpincode.in/pincode/" + pincode
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
        resp = req_lib.get(url, headers=headers, timeout=10)
        data = resp.json()
        logger.info("booth lookup", extra={"json_fields": {"pincode": pincode}})
        if data and isinstance(data, list) and data[0].get("Status") == "Success":
            return {"status": "success", "offices": data[0].get("PostOffice", [])}
        return {"status": "error", "message": "No booth found for this pincode."}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error fetching postal data: " + str(e))


# Serve React SPA -- mounted LAST so API routes above take priority
if os.path.isdir("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8080)), reload=False)
