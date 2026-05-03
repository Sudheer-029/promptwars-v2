"""Tests for HTTP security headers on all endpoints."""
import pytest

SECURE_ENDPOINTS = ["/api/healthz"]
SECURITY_HEADERS = [
    "x-content-type-options",
    "x-frame-options",
    "x-xss-protection",
    "referrer-policy",
    "permissions-policy",
    "strict-transport-security",
]


@pytest.mark.parametrize("endpoint", SECURE_ENDPOINTS)
def test_security_headers_present(client, endpoint):
    resp = client.get(endpoint)
    for header in SECURITY_HEADERS:
        assert header in resp.headers, f"Missing security header: {header}"


def test_x_content_type_options_value(client):
    resp = client.get("/api/healthz")
    assert resp.headers["x-content-type-options"] == "nosniff"


def test_x_frame_options_value(client):
    resp = client.get("/api/healthz")
    assert resp.headers["x-frame-options"] == "DENY"


def test_xss_protection_value(client):
    resp = client.get("/api/healthz")
    assert resp.headers["x-xss-protection"] == "1; mode=block"


def test_referrer_policy_value(client):
    resp = client.get("/api/healthz")
    assert "strict-origin" in resp.headers["referrer-policy"]


def test_permissions_policy_disables_camera(client):
    resp = client.get("/api/healthz")
    assert "camera=()" in resp.headers["permissions-policy"]


def test_hsts_header_present(client):
    resp = client.get("/api/healthz")
    assert "max-age" in resp.headers["strict-transport-security"]


def test_chat_endpoint_has_security_headers(client):
    resp = client.post("/api/chat", json={"query": "What is NOTA?"})
    for header in SECURITY_HEADERS:
        assert header in resp.headers


def test_invalid_route_returns_json_not_html(client):
    resp = client.get("/api/does-not-exist")
    assert resp.status_code == 404
    assert "error" in resp.json()
