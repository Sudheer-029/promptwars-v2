import os
import sys
import pytest
from unittest.mock import MagicMock, patch

# Must be set before main.py is imported
os.environ.setdefault("GEMINI_API_KEY", "test-api-key-for-ci")
os.environ.setdefault("PORT", "8080")

# Create static dir so StaticFiles mount does not fail during tests
os.makedirs("static", exist_ok=True)


def _make_mock_client():
    client = MagicMock()
    response = MagicMock()
    response.text = "Carry your EPIC card to your assigned polling booth on election day."
    client.models.generate_content.return_value = response
    return client


@pytest.fixture(scope="session")
def mock_gemini():
    return _make_mock_client()


@pytest.fixture(scope="session")
def client(mock_gemini):
    import main
    main._client = mock_gemini  # inject before TestClient triggers lifespan
    from fastapi.testclient import TestClient
    with TestClient(main.app, raise_server_exceptions=True) as c:
        yield c
