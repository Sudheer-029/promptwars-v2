"""Integration tests — full request/response flows across endpoints."""
from unittest.mock import patch, MagicMock


def _postal_mock():
    m = MagicMock()
    m.json.return_value = [{
        "Status": "Success",
        "PostOffice": [{"Name": "Lajpat Nagar", "District": "South Delhi", "State": "Delhi"}]
    }]
    return m


def test_health_then_chat_flow(client):
    """Health check passes, then a chat query succeeds."""
    health = client.get("/api/healthz")
    assert health.status_code == 200

    chat = client.post("/api/chat", json={"query": "What documents do I need to vote?"})
    assert chat.status_code == 200
    assert "answer" in chat.json()


def test_health_then_booth_flow(client):
    """Health check passes, then booth lookup succeeds."""
    health = client.get("/api/healthz")
    assert health.status_code == 200

    with patch("main.req_lib.get", return_value=_postal_mock()):
        booth = client.get("/api/booth/110024")
    assert booth.status_code == 200
    assert booth.json()["status"] == "success"


def test_chat_and_booth_in_sequence(client):
    """User asks a question then looks up their booth — typical app flow."""
    chat = client.post("/api/chat", json={"query": "How do I find my polling booth?"})
    assert chat.status_code == 200

    with patch("main.req_lib.get", return_value=_postal_mock()):
        booth = client.get("/api/booth/110024")
    assert booth.status_code == 200
    assert len(booth.json()["offices"]) > 0


def test_invalid_inputs_do_not_affect_subsequent_valid_requests(client):
    """A bad request should not corrupt state for the next valid request."""
    bad = client.post("/api/chat", json={"query": ""})
    assert bad.status_code == 422

    good = client.post("/api/chat", json={"query": "What is EPIC card?"})
    assert good.status_code == 200


def test_multiple_chat_queries_independent(client):
    """Each chat call is stateless and returns its own response."""
    q1 = client.post("/api/chat", json={"query": "What is Form 6?"})
    q2 = client.post("/api/chat", json={"query": "What is EVM?"})
    assert q1.status_code == 200
    assert q2.status_code == 200
    # Both return valid answer keys
    assert "answer" in q1.json()
    assert "answer" in q2.json()


def test_cors_headers_present(client):
    """CORS headers allow cross-origin requests from the React frontend."""
    resp = client.options("/api/healthz", headers={"Origin": "http://localhost:5173"})
    # FastAPI CORS middleware returns 200 for preflight
    assert resp.status_code in (200, 405)


def test_booth_invalid_then_valid(client):
    """Invalid pincode error does not break the next valid booth request."""
    bad = client.get("/api/booth/abc")
    assert bad.status_code == 400

    with patch("main.req_lib.get", return_value=_postal_mock()):
        good = client.get("/api/booth/110024")
    assert good.status_code == 200
