"""Pydantic request / response schemas for the ElectaGuide API."""
from pydantic import BaseModel, Field, field_validator
import html


class ChatRequest(BaseModel):
    """Incoming chat query — sanitised and length-bounded."""
    query: str = Field(..., min_length=1, max_length=500, description="Voter question in any supported language")

    @field_validator("query")
    @classmethod
    def sanitize_query(cls, v: str) -> str:
        """Strip whitespace and escape HTML entities to prevent injection."""
        return html.escape(v.strip())


class ChatResponse(BaseModel):
    """Structured response from Chunav Mitra AI."""
    answer: str = Field(..., description="AI-generated answer")
    model: str = Field(..., description="Gemini model that served the response")


class BoothOffice(BaseModel):
    """Single post office record returned by the postal API."""
    Name: str
    District: str | None = None
    State: str | None = None
    Pincode: str | None = None
    BranchType: str | None = None
    DeliveryStatus: str | None = None
    Circle: str | None = None
    Division: str | None = None
    Region: str | None = None
    Block: str | None = None
    Country: str | None = None


class BoothResponse(BaseModel):
    """Post office lookup result."""
    status: str = Field(..., description="'success' or 'error'" )
    offices: list[dict] | None = Field(default=None)
    message: str | None = Field(default=None)


class HealthResponse(BaseModel):
    """Liveness probe response."""
    status: str = "ok"
