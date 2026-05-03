"""Custom middleware for ElectaGuide backend."""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Injects HTTP security headers on every response.

    Headers set:
    - X-Content-Type-Options: prevents MIME-type sniffing
    - X-Frame-Options: blocks clickjacking via iframes
    - X-XSS-Protection: enables browser XSS filter (legacy browsers)
    - Referrer-Policy: limits referrer information leakage
    - Permissions-Policy: disables unused browser features
    - Strict-Transport-Security: enforces HTTPS (when deployed)
    """

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
        response.headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains"
        return response
