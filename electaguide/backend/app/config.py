"""Application settings loaded from environment variables."""
import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Centralised config -- read once at startup."""

    gemini_api_key: str = os.environ.get("GEMINI_API_KEY", "").strip()
    gcp_project: str = os.environ.get("GCP_PROJECT", "")
    gcp_location: str = os.environ.get("GCP_LOCATION", "us-central1")
    port: int = int(os.environ.get("PORT", 8080))
    rate_limit: str = "10/minute"
    booth_cache_size: int = 512
    postal_api_url: str = "https://api.postalpincode.in/pincode/"
    studio_models: list = ["gemini-2.5-flash", "gemini-2.0-flash"]
    vertex_models: list = ["gemini-2.5-flash-preview-05-20", "gemini-2.0-flash-001"]

    @property
    def use_vertex(self) -> bool:
        return not self.gemini_api_key


settings = Settings()
