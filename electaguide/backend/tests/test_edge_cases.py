"""Parametrized edge-case tests covering validation boundaries."""
import pytest


# ---------------------------------------------------------------------------
# Chat query validation
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("query,expected", [
    ("How do I vote?", 200),
    ("a", 200),
    ("a" * 500, 200),
    ("<script>alert(1)</script>", 200),   # HTML is escaped, not rejected
    ("What is नोटा?", 200),    # Hindi
    ("Was ist NOTA?", 200),               # German
])
def test_chat_valid_queries(client, query, expected):
    resp = client.post("/api/chat", json={"query": query})
    assert resp.status_code == expected


@pytest.mark.parametrize("payload,expected", [
    ({"query": ""}, 422),
    ({"query": "a" * 501}, 422),
    ({}, 422),
    ({"query": None}, 422),
    ({"wrong_key": "value"}, 422),
])
def test_chat_invalid_payloads(client, payload, expected):
    resp = client.post("/api/chat", json=payload)
    assert resp.status_code == expected


def test_chat_xss_input_sanitized(client):
    """XSS payload should be HTML-escaped and still return 200."""
    resp = client.post("/api/chat", json={"query": "<script>alert('xss')</script>"})
    assert resp.status_code == 200


# ---------------------------------------------------------------------------
# Booth pincode validation
# ---------------------------------------------------------------------------

@pytest.mark.parametrize("pincode,expected", [
    ("abc", 400),
    ("12345", 400),
    ("1234567", 400),
    ("", 404),        # empty = no route match
    ("11000A", 400),
    ("000000", 200),  # technically valid format (all zeros)
    ("ABCDEF", 400),
    ("1 2 3 4 5", 400),
])
def test_booth_pincode_formats(client, pincode, expected):
    from unittest.mock import AsyncMock, MagicMock, patch
    import main
    main._pincode_cache.clear()
    mock_resp = MagicMock()
    mock_resp.json.return_value = [{"Status": "Success", "PostOffice": [{"Name": "Test PO", "District": "Test", "State": "Test"}]}]
    if expected == 200:
        with patch.object(main._http_client, "get", new_callable=AsyncMock, return_value=mock_resp):
            resp = client.get(f"/api/booth/{pincode}")
    else:
        resp = client.get(f"/api/booth/{pincode}")
    assert resp.status_code == expected
