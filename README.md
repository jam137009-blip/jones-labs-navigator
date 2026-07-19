# Jones Labs Navigator

**A guided clarity experience.** Share what you want to accomplish — Navigator identifies the question beneath the question and recommends the single next move most likely to create progress.

---

## What It Does

Navigator is a single-page AI-guided experience that walks users through a structured clarity process:

1. **Welcome** — Introduction and framing
2. **Intention** — User describes what they want to accomplish in their own words
3. **Analysis** — AI interprets the intention into 3–5 distinct hypotheses
4. **Patterns** — User selects the hypothesis (or hypotheses) that best match their meaning, with optional correction and adaptive expertise mode
5. **Clarification** *(optional)* — AI asks at most one precision question if it would materially change the recommendation
6. **Result** — Full Navigator Insight with: the question beneath the question, current/desired reality, primary constraint, assumptions worth testing, decision paths, and a single recommended next action
7. **Reflection** — User commits to their next move
8. **Safety** — Shown if the AI detects urgent risk; provides calm, appropriate guidance

**Draft auto-saves** to `localStorage`. No account, no tracking, no server-side storage of sessions.

---

## Architecture

```
jones-labs-navigator/
├── artifacts/
│   ├── navigator/          # React + Vite SPA (frontend)
│   │   └── src/
│   │       ├── App.tsx         # Full state-machine SPA (all screens)
│   │       ├── navigator.ts    # Types, validators, sample data
│   │       ├── index.css       # Design system (CSS variables, components)
│   │       └── main.tsx        # React entry point
│   └── api-server/         # Express API server (backend)
│       └── src/
│           ├── routes/
│           │   ├── navigate.ts # POST /api/navigate — OpenAI integration
│           │   └── index.ts    # Route wiring
│           └── index.ts        # Express app setup
├── lib/
│   ├── api-spec/           # OpenAPI spec + codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   └── api-zod/            # Generated Zod validators
└── pnpm-workspace.yaml
```

**Frontend** → `artifacts/navigator` — pure React SPA, no router. State machine controls which screen is visible. All AI calls are plain `fetch("/api/navigate")`.

**Backend** → `artifacts/api-server` — Express server. `POST /api/navigate` validates input, rate-limits (12 req / 10 min per IP), calls OpenAI Chat Completions with structured JSON schema output, and returns the parsed result.

**AI model**: `gpt-4o` via Chat Completions API with `response_format: { type: "json_schema" }` for guaranteed structured output.

---

## Setup

### Prerequisites

- Node.js 20+
- pnpm 9+
- An OpenAI API key (model access: `gpt-4o`)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set environment variables

In Replit, add the following secret:

| Secret | Description |
|--------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key |
| `SESSION_SECRET` | Random string for Express session signing |

For local development outside Replit, create a `.env` file in `artifacts/api-server/`:

```
OPENAI_API_KEY=sk-...
SESSION_SECRET=any-random-string
PORT=8080
```

### 3. Run in development

```bash
# Start both services (Replit manages this via workflows)
pnpm --filter @workspace/navigator run dev      # Frontend on $PORT
pnpm --filter @workspace/api-server run dev     # API server on 8080
```

### 4. Build for production

```bash
pnpm --filter @workspace/navigator run build
pnpm --filter @workspace/api-server run build
```

---

## Demo Instructions

### Live demo (requires OpenAI API key)

1. Open the app in your browser
2. Click **Start Discovery**
3. Type an intention — e.g.:
   - *"I want to decide whether to leave my current role and build something of my own"*
   - *"I'm trying to figure out why my team isn't shipping fast enough"*
   - *"I want to understand whether this product idea is worth pursuing"*
4. Click **Find the direction** — Navigator calls the OpenAI API (~5–10 seconds)
5. On the Patterns screen, select which hypothesis fits best (or "None of these")
6. Click **Continue** — Navigator calls OpenAI again for the full insight
7. Read the Navigator Insight — especially **The Question Beneath the Question** and **Your Next Move**
8. Click **Choose my next move** → check the commitment box → **Confirm**

### Sample demo (no API key needed)

If the API is unavailable, the Analysis screen shows an error with a **"Use sample demo"** button. This loads pre-seeded content that demonstrates the full UI without an API call. Sample content is clearly labeled as demo data.

### Three-minute presentation flow

| Time | Action |
|------|--------|
| 0:00–0:30 | Open app, read the welcome screen aloud: *"You don't need to know the right question yet."* Explain the problem: people get stuck not because they lack answers but because they don't know which question to ask. |
| 0:30–1:15 | Type the intention: *"I want to figure out whether to launch a new product line or double down on our existing one."* Click Find the direction. While it loads, explain that Navigator is calling GPT-4o with a structured schema — it always returns a valid interpretation. |
| 1:15–1:45 | Select one or two hypotheses. Adjust the expertise mode to "Expert." Click Continue. |
| 1:45–2:30 | Read **The Question Beneath the Question** and **Your Next Move** aloud. Show the Assumptions and Decision Paths sections briefly. |
| 2:30–3:00 | Click **Choose my next move** → commit → show the final commitment screen. Explain that the draft is saved to `localStorage` — no account, no server-side session. |

### Local URL

When running in Replit, the app is accessible at the Replit preview URL (shown in the preview pane). The API server runs on port 8080 internally and is proxied through the same domain at `/api/`.

For direct local testing:
- Frontend: `http://localhost:<PORT>/` (PORT set by Replit per artifact)
- API health: `http://localhost:8080/api/healthz`
- API navigate: `POST http://localhost:8080/api/navigate`

---

## API Reference

### `POST /api/navigate`

**Interpret stage** (first call):
```json
{
  "stage": "interpret",
  "intention": "I want to decide whether to launch a new product line",
  "expertiseOverride": null
}
```

**Result stage** (second call):
```json
{
  "stage": "result",
  "intention": "I want to decide whether to launch a new product line",
  "selectedHypotheses": [{ "id": "validate", "label": "Test market demand first" }],
  "correction": "",
  "clarificationAnswer": "Evidence from potential customers",
  "expertiseOverride": null
}
```

**Response** (both stages):
```json
{
  "data": { /* Interpretation or NavigatorResult object */ },
  "requestId": "uuid"
}
```

**Rate limit**: 12 requests per 10-minute window per IP.

---

## Design

- **Typography**: Cormorant Garant (serif display) + Inter (sans-serif body)
- **Palette**: Warm off-white (`#faf7f2`), deep forest (`#1a2e22`), aged gold (`#b8955a`)
- **No Tailwind component classes** — pure custom CSS with CSS variables for the design system
- **Responsive**: Works on mobile and desktop
- **Accessible**: ARIA labels, live regions, focus management throughout

---

## Key Design Decisions

- **No account required** — draft state lives in `localStorage`; privacy-first
- **One clarification question maximum** — the AI is instructed never to ask a second question
- **Structured output enforced** — JSON schema passed to OpenAI ensures the response always matches the expected type; the frontend validator (`isInterpretation`, `isNavigatorResult`) catches any malformed output
- **Graceful degradation** — if the API key is missing or OpenAI fails, the app offers a pre-seeded sample demo so the UX can still be demonstrated
- **Rate limiting** — in-memory bucket per IP, 12 requests per 10 minutes, no external dependency
