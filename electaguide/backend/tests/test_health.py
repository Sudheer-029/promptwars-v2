"""Tests for GET /api/healthz"""


def test_health_returns_200(client):
    resp = client.get("/api/healthz")
    assert resp.status_code == 200


def test_health_returns_ok_status(client):
    data = resp = client.get("/api/healthz").json()
    assert data["status"] == "ok"


def test_health_response_is_json(client):
    resp = client.get("/api/healthz")
    assert resp.headers["content-type"].startswith("application/json")


def test_health_is_idempotent(client):
    """Multiple calls return consistent results."""
    results = [client.get("/api/healthz").json() for _ in range(3)]
    assert all(r["status"] == "ok" for r in results)
