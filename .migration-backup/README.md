# Jones Labs Navigator

Jones Labs Navigator is an OpenAI Build Week **Apps for Your Life** project that helps people discover the right question before searching for an answer.

## Problem and thesis

Most AI begins with `Prompt → Answer`. People often possess an intended outcome before they possess the words, expertise, or question needed to express it. Navigator begins with an imperfect intention, recognizes plausible directions, asks only the highest-value precision question when needed, and recommends only after constructing sufficient understanding.

**Foundational law:** every question costs time, attention, and cognitive effort. It must materially reduce relevant uncertainty toward the intended outcome.

## Product experience

- Correctable exploratory, informed, and expert analysis modes
- Expert-mode evidence gaps, falsification questions, second-order effects, and explicit trade-offs

1. Share one imperfect intention.
2. Confirm, combine, or correct three concise intention hypotheses; a fourth appears only when materially distinct.
3. Answer at most one adaptive precision question.
4. Receive the Question Beneath the Question, a bounded interpretation, up to three decision paths, and one next move.
5. Refine once if necessary, then commit locally to an evidence-producing next move.

The experience is deliberately subtractive: no question, option, delay, animation, or summary section remains unless removing it would materially reduce understanding or decision readiness.

There are no visible agents, expert selectors, prompt engineering controls, accounts, or permanent consultation records.

## Architecture and GPT-5.6

- React 19, TypeScript, Next.js 16 structure, Vinext/Vite, Tailwind CSS 4
- Server-only OpenAI Responses API using `gpt-5.6`
- Strict JSON Schema Structured Outputs for interpretation and final insight stages
- A hidden Council is implemented as limited responsibilities inside one unified Navigator instruction—not a multi-agent orchestration system
- Input and output validation, 30-second timeout, one transient retry, rate limiting, sanitized request logs, and retryable UI errors
- Local browser draft persistence; API requests use `store: false`

Codex accelerated the project by turning the product specification into a working adaptive state machine, server contract, trust boundaries, tests, documentation, and deployable production build while preserving the original visual system.

## Trust and safety

Navigator distinguishes explicit facts from interpretations, visibly labels assumptions as hypotheses, calibrates confidence, explains what could change its interpretation, and preserves human decision authority. It never claims hidden psychological certainty or replaces professional or emergency assistance. Urgent-risk output pauses the ordinary consultation.

Consultation content is processed to generate the result. The MVP is not a private professional service; users should avoid unnecessary highly sensitive information. Restarting clears the local draft. Application logs contain request IDs, status, latency, and timestamps—not raw consultation text.

## Local setup

Requires Node.js 22.13+.

```bash
npm install
OPENAI_API_KEY=your_server_side_key npm run dev
```

Never expose `OPENAI_API_KEY` to client code or commit it. For deployment, add it as a secret production environment variable.

## Testing and build

```bash
npm test
npm run lint
npm run build
npm run validate:artifact
```

The seeded demo path is available only after an API error and is clearly labeled as sample content.

## Limitations

- One intention sample and at most one clarification cannot resolve every complex situation.
- Confidence is qualitative and should be calibrated through real-world evidence.
- In-memory rate limiting is intentionally lightweight for the hackathon MVP.
- No long-term learning, accounts, notifications, or permanent history.

## Future Mutual Accountability loop

**Human accountability:** did the person act, revise the intention, or identify a real constraint?

**Navigator accountability:** was the interpretation accurate, was confidence calibrated, and did the recommendation improve decision readiness?

Reality evaluates both.

See [PRODUCT_SPEC.md](./PRODUCT_SPEC.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [EVALUATION.md](./EVALUATION.md), [DEMO_SCRIPT.md](./DEMO_SCRIPT.md), and [SUBMISSION_CHECKLIST.md](./SUBMISSION_CHECKLIST.md).
