"""Tests for GET /api/booth/{pincode}"""
import pytest
from unittest.mock import patch, MagicMock


def _mock_postal_success(pincode="110001"):
    mock_resp = MagicMock()
    mock_resp.json.return_value = [{
        "Status": "Success",
        "PostOffice": [
            {"Name": "Connaught Place", "District": "New Delhi", "State": "Delhi"},
            {"Name": "Parliament Street", "District": "New Delhi", "State": "Delhi"},
        ]
    }]
    return mock_resp


def _mock_postal_not_found():
    mock_resp = MagicMock()
    mock_resp.json.return_value = [{"Status": "Error", "PostOffice": None}]
    return mock_resp


def test_booth_valid_pincode(client):
    with patch("main.req_lib.get", return_value=_mock_postal_success()):
        resp = client.get("/api/booth/110001")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "success"
    assert isinstance(data["offices"], list)
    assert len(data["offices"]) == 2


def test_booth_response_structure(client):
    with patch("main.req_lib.get", return_value=_mock_postal_success()):
        resp = client.get("/api/booth/110001")
    office = resp.json()["offices"][0]
    assert "Name" in office
    assert "District" in office
    assert "State" in office


def test_booth_pincode_not_found(client):
    with patch("main.req_lib.get", return_value=_mock_postal_not_found()):
        resp = client.get("/api/booth/999999")
    assert resp.status_code == 200
    assert resp.json()["status"] == "error"


def test_booth_short_pincode_rejected(client):
    resp = client.get("/api/booth/1234")
    assert resp.status_code == 400


def test_booth_long_pincode_rejected(client):
    resp = client.get("/api/booth/1234567")
    assert resp.status_code == 400


def test_booth_alpha_pincode_rejected(client):
    resp = client.get("/api/booth/ABCDEF")
    assert resp.status_code == 400


def test_booth_mixed_pincode_rejected(client):
    resp = client.get("/api/booth/11000A")
    assert resp.status_code == 400


def test_booth_empty_pincode_returns_404(client):
    """Route does not exist without pincode param."""
    resp = client.get("/api/booth/")
    assert resp.status_code == 404


def test_booth_external_api_failure(client):
    with patch("main.req_lib.get", side_effect=Exception("Connection timeout")):
        resp = client.get("/api/booth/110001")
    assert resp.status_code == 500


def test_booth_five_digit_pincode_rejected(client):
    resp = client.get("/api/booth/11000")
    assert resp.status_code == 400


def test_booth_zero_padded_valid(client):
    with patch("main.req_lib.get", return_value=_mock_postal_success()):
        resp = client.get("/api/booth/011001")
    assert resp.status_code == 200
