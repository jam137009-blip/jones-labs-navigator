# Architecture

## User flow

```text
Welcome → Intention → Interpretation hypotheses → Confirmation/correction
  → Analysis → optional one precision question → Navigator Insight
  → optional one refinement → focused local evidence commitment
```

Urgent risk branches to a safety state. API errors preserve the local draft and offer retry or a clearly labeled seeded demo.

## Server flow

```text
Client → POST /api/navigate → input limits → rate limit
  → GPT-5.6 Responses API → strict schema → runtime validation
  → sanitized status log → client-safe structured data
```

Two schema stages keep each response focused:

- `interpret`: interpreted intention, three concise hypotheses (a fourth only if materially distinct), explicit facts, greatest uncertainty, proposed precision question, sufficiency, safety, limitations.
- `result`: signature question, realities, constraint, hypothesis evidence, up to three paths, one action, confidence, limitations, optional clarification, safety.

## Hidden Council responsibilities

Expertise adaptation is part of interpretation, not a separate visible agent. The response carries a provisional `exploratory`, `informed`, or `expert` mode plus a brief evidence statement. The user can override it before synthesis. That local override is sent as bounded user data, never as a privileged instruction. Final output structurally includes evidence gaps, a falsification question, and second-order effects so advanced analysis is challengeable rather than merely more technical in tone.

Mission relevance, intention, patterns, reality, constraints, hypotheses, precision-question selection, challenge, sufficiency, and final synthesis are limited internal responsibilities inside one Navigator instruction. They are not independent agents, calls, personalities, or visible outputs. Hidden chain-of-thought is never requested or displayed.

Every Council output passes a private seven-part optimization gate: mission relevance, direct relevance, precision, greatest-uncertainty reduction, sufficiency, evidence grounding, and simplicity. This is one instruction-level evaluation, not additional calls or orchestration.

## Security boundaries

- API key is read only by the server route.
- User content is serialized as untrusted `userData`, separate from system instructions.
- Structured Outputs cannot change schema based on user text.
- Input lengths and array sizes are bounded.
- Requests use `store: false`.
- Logs contain only request ID, timestamp, status, and latency.
- Rate limiting, timeout, and one transient retry constrain abuse and failure duration.

## Failure handling

- Invalid user input: inline, actionable 400 response.
- Missing credential: 503 without losing the local draft.
- Timeout: retryable 504.
- Upstream or malformed output: retryable 502.
- Refresh during analysis: resume from the nearest stable saved state.
- Seeded demo: user-initiated and explicitly labeled after failure; never silently substituted.
