# ElectaGuide India

An AI-powered voter assistance app for India, built for the Prompt Wars v2 hackathon.

**Live:** https://electaguide-152578302488.us-central1.run.app

---

## Features

| Feature | Description |
|---------|-------------|
| **Chunav Mitra** | Gemini 2.5 Flash chatbot answering voter registration, polling, and ECI-related queries in plain language |
| **Booth Finder** | Enter any 6-digit Indian pincode to find nearby post offices and polling area details |

---

## Stack

- **Frontend:** React 18 + Vite (SPA, served from backend)
- **Backend:** FastAPI, Python 3.11
- **AI:** Gemini 2.5 Flash via Google AI Studio (`google-genai` SDK)
- **Deploy:** Google Cloud Run
- **Secrets:** Google Secret Manager

---

## Project structure

```
electaguide/
+-- frontend/
|   +-- src/
|       +-- App.jsx       # Chat UI + booth lookup
|       +-- data.js       # Election reference data
+-- backend/
    +-- main.py           # API routes + Gemini client
    +-- Dockerfile
    +-- requirements.txt
```

---

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/healthz` | Health check |
| POST | `/api/chat` | Send `{"query": "..."}` - returns AI response |
| GET | `/api/booth/{pincode}` | Post offices for a 6-digit pincode |

Rate limit: 10 requests/min per IP on `/api/chat`.

---

## Local development

**Prerequisites:** Python 3.11+, Node.js 18+, a [Gemini API key](https://aistudio.google.com/apikey)

**Backend**
```bash
cd electaguide/backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
echo "GEMINI_API_KEY=your_key_here" > .env
python main.py        # http://localhost:8080
```

**Frontend**
```bash
cd electaguide/frontend
npm install
npm run dev           # http://localhost:5173 (proxies /api to :8080)
```

To bundle the frontend into the backend before deploying:
```bash
cd electaguide/frontend && npm run build
cp -r dist/* ../backend/static/
```

---

## Deploy to Cloud Run

```bash
# One-time: enable APIs and store your key
gcloud services enable run.googleapis.com secretmanager.googleapis.com
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
| `PORT` | No | Server port (default: `8080`, set automatically by Cloud Run) |

---

## License

MIT
