# ElectaGuide India ???

An AI-powered voter assistance app for India, built for the **Prompt Wars v2** hackathon.

**Live demo:** https://electaguide-152578302488.us-central1.run.app

---

## What it does

ElectaGuide helps Indian voters with two things:

| Feature | Description |
|---------|-------------|
| **Chunav Mitra** | AI chatbot (Gemini 2.5 Flash) that answers questions about voter registration, polling procedures, ECI rules, and voting rights — in plain language, unbiased |
| **Booth Finder** | Enter any Indian pincode to find nearby post offices and polling area details |

---

## Architecture

```
electaguide/
+-- frontend/          # React 18 + Vite SPA
¦   +-- src/
¦       +-- App.jsx    # Main app — chat UI + booth lookup
¦       +-- main.jsx
+-- backend/           # FastAPI server (serves API + static SPA)
    +-- main.py        # API routes + Gemini client
    +-- Dockerfile
    +-- requirements.txt
    +-- static/        # Built frontend (npm run build output)
```

**Stack:**
- Frontend: React 18, Vite
- Backend: FastAPI, Python 3.11, `google-genai` SDK
- AI: Gemini 2.5 Flash (Google AI Studio)
- Deploy: Google Cloud Run (single container — backend serves static frontend)
- Secrets: Google Secret Manager
- CI/CD: Cloud Build (`gcloud run deploy --source .`)

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/healthz` | Health check |
| `POST` | `/api/chat` | Chat with Chunav Mitra (`{"query": "..."}`) |
| `GET` | `/api/booth/{pincode}` | Post offices for a 6-digit pincode |
| `GET` | `/` | React SPA |

Rate limit: 10 requests/minute per IP on `/api/chat`.

---

## Local development

### Prerequisites
- Python 3.11+
- Node.js 18+
- A Gemini API key from https://aistudio.google.com/apikey

### Backend

```bash
cd electaguide/backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

echo "GEMINI_API_KEY=your_key_here" > .env
python main.py
# API at http://localhost:8080
```

### Frontend

```bash
cd electaguide/frontend
npm install
npm run dev
# Dev server at http://localhost:5173
```

To build frontend and embed it in the backend:

```bash
cd electaguide/frontend
npm run build
cp -r dist/* ../backend/static/
```

---

## Deploy to Cloud Run

```bash
# One-time setup
gcloud services enable run.googleapis.com secretmanager.googleapis.com

# Store API key
echo "YOUR_GEMINI_KEY" | gcloud secrets create gemini-api-key --data-file=-

# Deploy
cd electaguide/backend
gcloud run deploy electaguide \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --update-secrets="GEMINI_API_KEY=gemini-api-key:latest"
```

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | Yes | Google AI Studio API key |
| `GCP_PROJECT` | No | GCP project ID (default: `promptwars-v2`) |
| `GCP_LOCATION` | No | GCP region (default: `us-central1`) |
| `PORT` | No | Server port (default: `8080`, set by Cloud Run) |

---

## Notes

- The backend serves the React SPA via `StaticFiles` — no separate frontend hosting needed
- If `GEMINI_API_KEY` is not set, the app falls back to Vertex AI (requires `roles/aiplatform.user` on the Cloud Run service account)
- Free-tier Gemini quota: 20 requests/day for `gemini-2.5-flash`

---

## License

MIT
