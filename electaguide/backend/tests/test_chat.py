"""Tests for POST /api/chat"""
import pytest


def test_chat_valid_query(client):
    resp = client.post("/api/chat", json={"query": "How do I register to vote?"})
    assert resp.status_code == 200
    data = resp.json()
    assert "answer" in data
    assert isinstance(data["answer"], str)
    assert len(data["answer"]) > 0


def test_chat_returns_model_name(client):
    resp = client.post("/api/chat", json={"query": "What is NOTA?"})
    assert resp.status_code == 200
    assert "model" in resp.json()


def test_chat_empty_query_rejected(client):
    """Empty string violates min_length=1 constraint."""
    resp = client.post("/api/chat", json={"query": ""})
    assert resp.status_code == 422


def test_chat_missing_query_field_rejected(client):
    resp = client.post("/api/chat", json={})
    assert resp.status_code == 422


def test_chat_query_too_long_rejected(client):
    """Queries over 500 chars violate max_length=500."""
    resp = client.post("/api/chat", json={"query": "a" * 501})
    assert resp.status_code == 422


def test_chat_max_length_query_accepted(client):
    resp = client.post("/api/chat", json={"query": "a" * 500})
    assert resp.status_code == 200


def test_chat_single_character_query(client):
    resp = client.post("/api/chat", json={"query": "?"})
    assert resp.status_code == 200


def test_chat_hindi_query(client):
    resp = client.post("/api/chat", json={"query": "वोट कैसे डालें?"})
    assert resp.status_code == 200


def test_chat_special_characters_query(client):
    resp = client.post("/api/chat", json={"query": "What is NOTA? #election @ECI"})
    assert resp.status_code == 200


def test_chat_wrong_method_rejected(client):
    resp = client.get("/api/chat")
    assert resp.status_code == 405


def test_chat_no_body_rejected(client):
    resp = client.post("/api/chat")
    assert resp.status_code == 422
