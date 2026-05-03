import os
import pytest
from unittest.mock import MagicMock

os.environ.setdefault("GEMINI_API_KEY", "test-api-key-for-ci")
os.environ.setdefault("PORT", "8080")
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
    main._gemini_client = mock_gemini
    from fastapi.testclient import TestClient
    with TestClient(main.app, raise_server_exceptions=True) as c:
        yield c
