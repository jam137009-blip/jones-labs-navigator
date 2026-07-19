# Build Week Submission — Jones Labs Navigator

## Project Name
**Jones Labs Navigator**

## Tagline
*You don't need to know the right question yet.*

## One-Line Description
An AI-guided clarity experience that identifies the question beneath your question and recommends the single next move most likely to create progress.

---

## The Problem

People get stuck — not because they lack answers, but because they're asking the wrong question. Traditional AI tools answer the question you ask. Navigator finds the question you should have asked.

Most AI assistants:
- Take your question at face value
- Return generic advice
- Leave you with more options, not more clarity
- Never surface the assumption worth testing first

Navigator does the opposite: it interprets, challenges, and narrows — until it can give you one precise next move.

---

## What We Built

A full-stack AI SPA with eight screens and a structured two-stage AI pipeline:

### Stage 1: Interpret
- User describes their intention in plain language
- **GPT-5.6-sol** (via Responses API) interprets the real intent, separates explicit facts from assumptions, generates 3–5 competing hypothesis directions as structured JSON, infers expertise level (exploratory / informed / expert), and identifies the greatest remaining uncertainty

### Stage 2: Result
- User selects which hypotheses match their meaning (or corrects Navigator's interpretation)
- Optional: AI asks at most one precision clarification question
- **GPT-5.6-sol** (via Responses API) compares decision paths and consequences, challenges its own leading interpretation, and returns a full Navigator Insight:
  - **The Question Beneath the Question** — the single precision question most likely to unlock movement
  - Current reality vs. desired reality
  - Primary constraint
  - Assumptions worth testing (3, labelled as hypotheses — not conclusions)
  - Decision paths (up to 3, with trade-offs)
  - **One recommended next action** with observable completion evidence
  - Confidence level + falsification question
  - Evidence gaps + second-order effects

### Safety
- If the AI detects urgent risk, the ordinary consultation is paused and calm, appropriate guidance is shown

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 7, TypeScript, custom CSS |
| Backend | Express (TypeScript), pnpm monorepo |
| AI — runtime | OpenAI `gpt-5.6-sol` via Responses API (`POST /v1/responses`), `text.format.type: json_schema`, `strict: true` |
| AI — build tooling | OpenAI Codex (Replit Agent) — used to port the Next.js prototype, implement the Express API server, author structured JSON validators, and debug the production build pipeline |
| State | `localStorage` (no server-side session) |
| Hosting | Replit (development + deployment) |

---

## What Makes It Different

1. **Structured output enforced at the schema level** — The AI cannot return a malformed response. Every field is validated before it reaches the frontend. If validation fails, the user sees an error, not corrupted UI.

2. **One question maximum** — The system prompt instructs the AI never to ask a second clarification question. After one answer, it commits to an interpretation and explains its confidence level.

3. **Hypotheses, not conclusions** — Every assumption is explicitly labelled as a hypothesis. The app never presents AI output as fact.

4. **Privacy by design** — No account, no cookies, no server-side session storage. Draft auto-saves to `localStorage`. The user owns their data.

5. **Graceful degradation** — If OpenAI is unavailable, a "Use sample demo" button loads pre-seeded content that demonstrates the full experience. No silent failures.

---

## Demo Flow (3 Minutes)

### Setup (before demo)
- App running at the Replit preview URL
- `OPENAI_API_KEY` set in Replit secrets
- Browser open to the welcome screen

### Script

**[0:00–0:30] The Problem**
> "This is Jones Labs Navigator. The premise is simple: most people aren't stuck because they lack answers — they're stuck because they're asking the wrong question. You don't need to know the right question yet. That's Navigator's job."

Click **Start Discovery**.

**[0:30–1:15] Intention**
Type: *"I want to figure out whether to launch a new product line or double down on what's already working."*

> "Navigator doesn't need perfectly formed input. It interprets what you mean, not just what you say."

Click **Find the direction**. While loading:
> "Navigator is calling GPT-5.6 via the Responses API with a strict JSON schema. The response always matches the expected type — if it doesn't, the user sees a clean error and can retry."

**[1:15–1:45] Patterns**
Three hypotheses appear. Select one or two. Show the expertise mode selector:
> "Navigator infers your expertise level from your language and adapts the depth of its analysis. You can override it here."

Click **Continue**.

**[1:45–2:30] The Insight**
Read **The Question Beneath the Question** aloud. Then:
> "This is the precision question most likely to unlock real movement. Not generic advice — one specific question."

Show **Your Next Move** — one action, with why, and what completion looks like.

**[2:30–3:00] Commitment**
Click **Choose my next move**. Check the commitment box.
> "Navigator asks you to commit. Not to a plan — to one action. Real-world evidence, not motivation claims, will determine whether this recommendation was useful."

Show the final screen. Done.

---

## Files Added / Modified

### New files
| File | Description |
|------|-------------|
| `artifacts/navigator/src/App.tsx` | Full SPA state machine — all 8 screens |
| `artifacts/navigator/src/navigator.ts` | Types, validators (`isInterpretation`, `isNavigatorResult`), sample data, `loadDraft` |
| `artifacts/navigator/src/index.css` | Full design system — CSS variables, typography, all component styles |
| `artifacts/navigator/src/main.tsx` | React entry point (cleaned of unused scaffold imports) |
| `artifacts/navigator/index.html` | Page title + meta description |
| `artifacts/api-server/src/routes/navigate.ts` | `POST /api/navigate` — rate limiting, OpenAI Chat Completions, JSON schema validation |
| `README.md` | Setup, architecture, demo instructions |
| `BUILD_WEEK_SUBMISSION.md` | This file |

### Modified files
| File | Change |
|------|--------|
| `artifacts/navigator/vite.config.ts` | Removed hard PORT/BASE_PATH crash — graceful defaults for `build` context |
| `artifacts/api-server/src/routes/index.ts` | Added `navigateRouter` |
| `lib/api-spec/openapi.yaml` | Restored to health-only spec (navigate uses raw fetch, not generated hooks) |
| `lib/api-client-react/src/generated/api.ts` | Regenerated from spec |
| `lib/api-client-react/src/generated/api.schemas.ts` | Regenerated from spec |
| `lib/api-zod/src/generated/api.ts` | Regenerated from spec |
| `lib/api-zod/src/generated/types/` | Regenerated from spec |

---

## Repo
[github.com/jam137009-blip/jones-labs-navigator](https://github.com/jam137009/jones-labs-navigator)

---

## Team
Jones Labs

---

*Built during Build Week on Replit. Ported from a Vercel/Next.js prototype to a Replit pnpm monorepo with a full Express backend and production-ready structured AI output.*
