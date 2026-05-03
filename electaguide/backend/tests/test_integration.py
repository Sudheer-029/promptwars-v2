"""Integration tests -- full request/response flows across endpoints."""
from unittest.mock import AsyncMock, MagicMock, patch


def _postal_mock():
    m = MagicMock()
    m.json.return_value = [{
        "Status": "Success",
        "PostOffice": [{"Name": "Lajpat Nagar", "District": "South Delhi", "State": "Delhi"}]
    }]
    return m


def test_health_then_chat_flow(client):
    """Health check passes, then a chat query succeeds."""
    assert client.get("/api/healthz").status_code == 200
    chat = client.post("/api/chat", json={"query": "What documents do I need to vote?"})
    assert chat.status_code == 200
    assert "answer" in chat.json()


def test_health_then_booth_flow(client):
    import main; main._pincode_cache.clear()
    assert client.get("/api/healthz").status_code == 200
    with patch.object(main._http_client, "get", new_callable=AsyncMock, return_value=_postal_mock()):
        booth = client.get("/api/booth/110024")
    assert booth.status_code == 200
    assert booth.json()["status"] == "success"


def test_chat_and_booth_in_sequence(client):
    """Typical app flow: user asks a question then looks up their booth."""
    import main; main._pincode_cache.clear()
    chat = client.post("/api/chat", json={"query": "How do I find my polling booth?"})
    assert chat.status_code == 200
    with patch.object(main._http_client, "get", new_callable=AsyncMock, return_value=_postal_mock()):
        booth = client.get("/api/booth/110024")
    assert booth.status_code == 200
    assert len(booth.json()["offices"]) > 0


def test_invalid_inputs_do_not_affect_subsequent_valid_requests(client):
    bad = client.post("/api/chat", json={"query": ""})
    assert bad.status_code == 422
    good = client.post("/api/chat", json={"query": "What is EPIC card?"})
    assert good.status_code == 200


def test_multiple_chat_queries_independent(client):
    q1 = client.post("/api/chat", json={"query": "What is Form 6?"})
    q2 = client.post("/api/chat", json={"query": "What is EVM?"})
    assert q1.status_code == q2.status_code == 200
    assert "answer" in q1.json() and "answer" in q2.json()


def test_chat_response_model_fields(client):
    """Response must contain both answer and model fields (ChatResponse schema)."""
    resp = client.post("/api/chat", json={"query": "What is NOTA?"})
    data = resp.json()
    assert "answer" in data
    assert "model" in data


def test_booth_invalid_then_valid(client):
    import main; main._pincode_cache.clear()
    assert client.get("/api/booth/abc").status_code == 400
    with patch.object(main._http_client, "get", new_callable=AsyncMock, return_value=_postal_mock()):
        good = client.get("/api/booth/110024")
    assert good.status_code == 200


def test_gzip_encoding_accepted(client):
    """API accepts gzip-encoded requests without error."""
    resp = client.get("/api/healthz", headers={"Accept-Encoding": "gzip"})
    assert resp.status_code == 200
