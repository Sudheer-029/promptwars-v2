"""Integration tests -- full request/response flows."""
from unittest.mock import AsyncMock, MagicMock, patch


def _postal_mock():
    m = MagicMock()
    m.json.return_value = [{"Status": "Success", "PostOffice": [{"Name": "Lajpat Nagar", "District": "South Delhi", "State": "Delhi"}]}]
    return m


def test_health_then_chat_flow(client):
    assert client.get("/api/healthz").status_code == 200
    chat = client.post("/api/chat", json={"query": "What documents do I need to vote?"})
    assert chat.status_code == 200 and "answer" in chat.json()


def test_health_then_booth_flow(client):
    import main; main._pincode_cache.clear()
    assert client.get("/api/healthz").status_code == 200
    with patch.object(main._http_client, "get", new_callable=AsyncMock, return_value=_postal_mock()):
        booth = client.get("/api/booth/110024")
    assert booth.status_code == 200 and booth.json()["status"] == "success"


def test_chat_and_booth_in_sequence(client):
    import main; main._pincode_cache.clear()
    chat = client.post("/api/chat", json={"query": "How do I find my polling booth?"})
    assert chat.status_code == 200
    with patch.object(main._http_client, "get", new_callable=AsyncMock, return_value=_postal_mock()):
        booth = client.get("/api/booth/110024")
    assert booth.status_code == 200 and len(booth.json()["offices"]) > 0


def test_invalid_does_not_corrupt_state(client):
    bad = client.post("/api/chat", json={"query": ""})
    assert bad.status_code == 422
    good = client.post("/api/chat", json={"query": "What is EPIC card?"})
    assert good.status_code == 200


def test_chat_response_schema(client):
    resp = client.post("/api/chat", json={"query": "What is NOTA?"})
    data = resp.json()
    assert "answer" in data and "model" in data


def test_booth_invalid_then_valid(client):
    import main; main._pincode_cache.clear()
    assert client.get("/api/booth/abc").status_code == 400
    with patch.object(main._http_client, "get", new_callable=AsyncMock, return_value=_postal_mock()):
        assert client.get("/api/booth/110024").status_code == 200


def test_gzip_encoding_accepted(client):
    resp = client.get("/api/healthz", headers={"Accept-Encoding": "gzip"})
    assert resp.status_code == 200


def test_security_headers_on_chat(client):
    resp = client.post("/api/chat", json={"query": "What is Form 6?"})
    assert resp.status_code == 200
    assert "x-content-type-options" in resp.headers
    assert "x-frame-options" in resp.headers
