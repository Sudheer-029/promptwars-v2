# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x     | Yes       |

## Reporting a Vulnerability

Please report security vulnerabilities by opening a **private** GitHub issue or emailing the maintainer directly. Do not disclose vulnerabilities publicly until they have been addressed.

Expected response time: 48 hours.

## Security Measures

- **Input validation** — All inputs validated via Pydantic with field-level constraints (min/max length, type checking)
- **Input sanitisation** — Chat queries are HTML-escaped before being forwarded to the AI model
- **Rate limiting** — 10 requests/minute per IP on  via SlowAPI
- **Security headers** — Every response includes , , , , , 
- **Secret management** — API keys stored in Google Secret Manager; never hardcoded
- **No verbose errors** — Stack traces are logged server-side (Cloud Logging) but never returned to clients
- **HTTPS enforced** — Deployed on Google Cloud Run with HSTS headers
