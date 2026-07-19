"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  EMPTY_DRAFT,
  SAMPLE_INTERPRETATION,
  SAMPLE_RESULT,
  STORAGE_KEY,
  isInterpretation,
  isMeaningful,
  isNavigatorResult,
  loadDraft,
  type NavigatorDraft,
  type NavigatorResult,
  type PrecisionQuestion,
  type ExpertiseMode,
} from "./navigator";

const ANALYSIS_STEPS = [
  "Understanding your intention",
  "Separating evidence from interpretation",
  "Identifying the greatest uncertainty",
  "Looking beneath the surface",
  "Building your Navigator Insight",
];

function Mark() { return <span className="brand-mark" aria-hidden="true">N</span>; }

function Header({ onRestart, showRestart }: { onRestart: () => void; showRestart: boolean }) {
  return <header className="site-header"><button className="brand" onClick={onRestart} aria-label="Navigator home"><Mark /><span>Jones Labs <strong>Navigator</strong></span></button>{showRestart && <button className="text-button" onClick={onRestart}>Start over</button>}</header>;
}

function Welcome({ onStart }: { onStart: () => void }) {
  return <section className="welcome enter" aria-labelledby="welcome-title">
    <div className="eyebrow"><span className="eyebrow-dot" /> A guided clarity experience</div>
    <h1 id="welcome-title">You don’t need to know the <em>right question</em> yet.</h1>
    <p className="lede">Share what you want to accomplish. Navigator will identify the question and next move most likely to create progress.</p>
    <button className="primary-button" onClick={onStart}>Start Discovery <span aria-hidden="true">→</span></button>
    <div className="welcome-notes" aria-label="Experience details"><span><i aria-hidden="true">◇</i> Draft saved locally</span><span><i aria-hidden="true">✓</i> No perfect words needed</span></div>
  </section>;
}

function Intention({ value, error, onChange, onSubmit, onBack }: { value: string; error: string; onChange: (value: string) => void; onSubmit: () => void; onBack: () => void }) {
  const input = useRef<HTMLTextAreaElement>(null);
  useEffect(() => input.current?.focus(), []);
  return <section className="consultation enter" aria-labelledby="intention-title">
    <div className="progress-meta"><span>Discovery consultation</span><span>Begin wherever you can</span></div><div className="progress-track" aria-hidden="true"><span style={{ width: "25%" }} /></div>
    <div className="question-card"><span className="question-number" aria-hidden="true">01</span><p className="question-kicker">Your intention</p>
      <h1 id="intention-title">What are you trying to accomplish?</h1>
      <p className="question-help">Use your own words. Include evidence or constraints only when they matter to the outcome.</p>
      <label className="sr-only" htmlFor="intention-answer">Your intention</label><textarea id="intention-answer" ref={input} value={value} onChange={(event) => onChange(event.target.value)} placeholder="What I want, even if I cannot explain it perfectly, is..." maxLength={4000} aria-invalid={Boolean(error)} aria-describedby={error ? "intention-error intention-hint" : "intention-hint"} />
      <div className="input-meta"><span id="intention-hint">Avoid unnecessary highly sensitive information.</span><span>{value.length}/4000</span></div>{error && <p className="field-error" id="intention-error" role="alert">{error}</p>}
    </div>
    <div className="navigation-row"><button className="secondary-button" onClick={onBack}>← Back</button><button className="primary-button compact" onClick={onSubmit}>Find the direction <span aria-hidden="true">→</span></button></div>
    <p className="autosave-note"><span aria-hidden="true">✓</span> Your draft is saved on this device and can be cleared by restarting</p>
  </section>;
}

function Analysis({ step, error, onRetry, onDemo, onEdit }: { step: number; error: string; onRetry: () => void; onDemo: () => void; onEdit: () => void }) {
  return <section className="analysis enter" aria-live="polite" aria-busy={!error}>
    <div className="analysis-orbit still" aria-hidden="true"><Mark /></div><p className="eyebrow centered">Constructing relevant understanding</p><h1>Creating your Navigator Insight</h1><p>Navigator will stop as soon as it has enough understanding to recommend a useful next move.</p>
    {error ? <div className="analysis-error" role="alert"><strong>We couldn’t complete this step.</strong><p>{error}</p><div><button className="primary-button compact" onClick={onRetry}>Try again</button><button className="secondary-button" onClick={onDemo}>Use sample demo</button><button className="text-button" onClick={onEdit}>Edit intention</button></div><small>Sample demo content is clearly seeded and is not presented as your AI result.</small></div>
      : <ol className="analysis-list">{ANALYSIS_STEPS.map((label, index) => <li key={label} className={index < step ? "done" : index === step ? "active" : ""}><span>{index < step ? "✓" : index + 1}</span>{label}</li>)}</ol>}
  </section>;
}

const MODE_LABELS: Record<ExpertiseMode, string> = { exploratory: "Exploratory", informed: "Informed", expert: "Expert" };

function Patterns({ draft, error, onToggle, onCorrection, onMode, onBack, onContinue }: { draft: NavigatorDraft; error: string; onToggle: (id: string) => void; onCorrection: (value: string) => void; onMode: (mode: ExpertiseMode) => void; onBack: () => void; onContinue: () => void }) {
  const interpretation = draft.interpretation!;
  const noneSelected = draft.selectedHypothesisIds.includes("none");
  return <section className="consultation patterns enter" aria-labelledby="patterns-title">
    <div className="progress-meta"><span>Pattern confirmation</span><span>Hypotheses—not conclusions</span></div><div className="progress-track" aria-hidden="true"><span style={{ width: "55%" }} /></div>
    <div className="question-card"><p className="question-kicker">What Navigator heard</p><h1 id="patterns-title">Which direction feels closest to what you mean?</h1><p className="question-help">Select one or more. These are interpretations generated from your words for you to confirm, combine, or correct.</p>
      <div className="expertise-panel"><div><span>Adaptive depth</span><strong>{MODE_LABELS[draft.expertiseOverride || interpretation.inferredExpertiseMode]} mode</strong><small>{draft.expertiseOverride ? "You selected this level." : interpretation.expertiseEvidence}</small></div><label htmlFor="expertise-mode">Adjust</label><select id="expertise-mode" value={draft.expertiseOverride || interpretation.inferredExpertiseMode} onChange={(event) => onMode(event.target.value as ExpertiseMode)}><option value="exploratory">Exploratory</option><option value="informed">Informed</option><option value="expert">Expert</option></select></div>
      <div className="hypothesis-grid">{interpretation.intentionHypotheses.map((hypothesis) => { const selected = draft.selectedHypothesisIds.includes(hypothesis.id); return <button key={hypothesis.id} className={`hypothesis-choice ${selected ? "selected" : ""}`} onClick={() => onToggle(hypothesis.id)} aria-pressed={selected}><span className="choice-check">{selected ? "✓" : "◇"}</span><span><strong>{hypothesis.label}</strong><small>{hypothesis.description}</small></span></button>; })}
        <button className={`hypothesis-choice ${noneSelected ? "selected" : ""}`} onClick={() => onToggle("none")} aria-pressed={noneSelected}><span className="choice-check">{noneSelected ? "✓" : "◇"}</span><span><strong>None of these fully captures it</strong><small>I want to clarify Navigator’s interpretation.</small></span></button></div>
      {(noneSelected || draft.correction) && <div className="correction-field"><label htmlFor="correction">What feels missing or different?</label><textarea id="correction" value={draft.correction} onChange={(event) => onCorrection(event.target.value)} placeholder="A closer interpretation would be..." maxLength={1500} /></div>}
      {error && <p className="field-error" role="alert">{error}</p>}
    </div><div className="navigation-row"><button className="secondary-button" onClick={onBack}>← Revise intention</button><button className="primary-button compact" onClick={onContinue}>Continue <span aria-hidden="true">→</span></button></div>
  </section>;
}

function Clarification({ question, value, selected, error, onValue, onChoice, onSubmit, onBack }: { question: PrecisionQuestion; value: string; selected: string[]; error: string; onValue: (value: string) => void; onChoice: (choice: string) => void; onSubmit: () => void; onBack: () => void }) {
  const choices = question.choices.filter(Boolean);
  const showText = question.answerType === "free_text" || selected.includes("Something else");
  return <section className="consultation clarification enter" aria-labelledby="clarification-title"><div className="progress-meta"><span>Precision question</span><span>One question maximum</span></div><div className="progress-track" aria-hidden="true"><span style={{ width: "78%" }} /></div>
    <div className="question-card"><span className="question-number" aria-hidden="true">◇</span><p className="question-kicker">Chosen to reduce the greatest uncertainty</p><h1 id="clarification-title">{question.question}</h1><p className="question-help">{question.reason}</p>
      {choices.length > 0 && <div className="precision-choices">{choices.map((choice) => { const active = selected.includes(choice); return <button key={choice} className={active ? "selected" : ""} aria-pressed={active} onClick={() => onChoice(choice)}>{active ? "✓ " : ""}{choice}</button>; })}</div>}
      {showText && <><label className="sr-only" htmlFor="precision-answer">Your answer</label><textarea id="precision-answer" autoFocus value={value} onChange={(event) => onValue(event.target.value)} placeholder="Something else I want Navigator to understand is..." maxLength={1500} /></>}
      {error && <p className="field-error" role="alert">{error}</p>}
    </div><div className="navigation-row"><button className="secondary-button" onClick={onBack}>← Back</button><button className="primary-button compact" onClick={onSubmit}>Build my insight <span aria-hidden="true">→</span></button></div>
  </section>;
}

function SummarySection({ number, title, children, accent = false }: { number: string; title: string; children: React.ReactNode; accent?: boolean }) { return <article className={`summary-section ${accent ? "signature" : ""}`}><div className="summary-heading"><span>{number}</span><h2>{title}</h2></div><div className="summary-content">{children}</div></article>; }

function Result({ result, refinementUsed, onReflect, onRestart, onRefine }: { result: NavigatorResult; refinementUsed: boolean; onReflect: () => void; onRestart: () => void; onRefine: (text: string) => void }) {
  const [refining, setRefining] = useState(false); const [refinement, setRefinement] = useState("");
  return <section className="summary enter" aria-labelledby="result-title"><div className="summary-intro"><p className="eyebrow centered">{MODE_LABELS[result.expertiseMode]} analysis</p><h1 id="result-title">Navigator Insight</h1><p>This is Navigator’s best interpretation based on what you shared. It is an invitation to refine—not a conclusion about you.</p></div>
    <div className="summary-sheet"><SummarySection number="★" title="The Question Beneath the Question" accent><p className="signature-question">“{result.questionBeneathTheQuestion}”</p><p className="signature-note">The precision question most likely to unlock useful movement.</p></SummarySection>
      <SummarySection number="01" title="What Navigator Heard"><p>{result.interpretedIntention}</p></SummarySection>
      <SummarySection number="02" title="Your Current Reality"><p>{result.currentReality}</p></SummarySection>
      <SummarySection number="03" title="Your Intended Outcome"><p>{result.desiredReality}</p></SummarySection>
      <SummarySection number="04" title="Your Primary Constraint"><p>{result.primaryConstraint}</p></SummarySection>
      <SummarySection number="05" title="Assumptions Worth Testing"><div className="hypothesis-label">Hypotheses—not conclusions</div><div className="assumption-cards">{result.assumptionsWorthTesting.map((assumption) => <div key={assumption.hypothesis}><strong>{assumption.hypothesis}</strong><p><b>Support:</b> {assumption.support}</p><p><b>Uncertainty:</b> {assumption.uncertainty}</p></div>)}</div></SummarySection>
      <SummarySection number="06" title="Possible Directions"><div className="decision-paths">{result.decisionPaths.map((path) => <article key={path.title}><h3>{path.title}</h3><p>{path.description}</p><span><b>Benefit:</b> {path.benefit}</span><span><b>Trade-off:</b> {path.tradeoff}</span></article>)}</div><p className="authority-note">These are possible directions. You retain decision authority.</p></SummarySection>
      <SummarySection number="07" title="Your Next Move"><div className="action-card"><span>One evidence-producing action</span><p>{result.recommendedNextAction.action}</p><small><b>Why:</b> {result.recommendedNextAction.whyThisAction}</small><small><b>Completion looks like:</b> {result.recommendedNextAction.completionEvidence}</small></div></SummarySection>
      <SummarySection number="08" title="Confidence and What Could Change This"><span className={`confidence-tag ${result.confidence}`}>{result.confidence} confidence</span><p>{result.whatCouldChangeThisInterpretation}</p><p className="limitations"><b>Limitations:</b> {result.limitations}</p></SummarySection>
      <SummarySection number="09" title="Challenge Test"><div className="challenge-block"><span>Evidence gaps</span><ul>{result.evidenceGaps.map((gap) => <li key={gap}>{gap}</li>)}</ul><span>Falsification question</span><p>{result.falsificationQuestion}</p>{result.secondOrderEffects.length > 0 && <><span>Second-order effects</span><ul>{result.secondOrderEffects.map((effect) => <li key={effect}>{effect}</li>)}</ul></>}</div></SummarySection>
    </div>
    {!refinementUsed && <div className="refinement-panel">{refining ? <><label htmlFor="refinement">What feels missing or inaccurate?</label><textarea id="refinement" value={refinement} onChange={(event) => setRefinement(event.target.value)} placeholder="Navigator should reconsider..." maxLength={1500} /><button className="primary-button compact" disabled={!isMeaningful(refinement, 3)} onClick={() => onRefine(refinement)}>Refine once</button></> : <button className="secondary-button" onClick={() => setRefining(true)}>Correct or refine this interpretation</button>}</div>}
    <div className="summary-actions"><button className="primary-button" onClick={onReflect}>Choose my next move <span aria-hidden="true">→</span></button><button className="text-button" onClick={onRestart}>Start a new discovery</button></div>
  </section>;
}

function Reflection({ result, onRestart, onResult }: { result: NavigatorResult; onRestart: () => void; onResult: () => void }) {
  const [committed, setCommitted] = useState(false); const [complete, setComplete] = useState(false);
  if (complete) return <section className="reflection complete enter"><div className="completion-mark">✓</div><p className="eyebrow centered">Commitment captured locally</p><h1>Reality is the final judge.</h1><div className="closing-card"><span>Your intended action</span><p>{result.recommendedNextAction.action}</p><hr /><span>Completion evidence</span><p>{result.recommendedNextAction.completionEvidence}</p></div><p className="evidence-note">Real-world evidence—not motivation claims—will determine whether this recommendation was useful.</p><button className="primary-button" onClick={onRestart}>Start another discovery <span aria-hidden="true">→</span></button></section>;
  return <section className="reflection enter" aria-labelledby="reflection-title"><p className="eyebrow centered">Decision readiness</p><h1 id="reflection-title">Will you test this next move?</h1><p className="reflection-lede">Commit only if the action is feasible and its completion evidence would reduce your uncertainty.</p>
    <label className={`commitment-check ${committed ? "selected" : ""}`}><input type="checkbox" checked={committed} onChange={(event) => setCommitted(event.target.checked)} /><span><strong>This is the action I intend to take.</strong><small>{result.recommendedNextAction.action}</small></span></label>
    <div className="navigation-row reflection-nav"><button className="secondary-button" onClick={onResult}>← Back to insight</button><button className="primary-button compact" disabled={!committed} onClick={() => setComplete(true)}>Confirm next move <span aria-hidden="true">→</span></button></div>
  </section>;
}

function Safety({ message, onRestart }: { message: string; onRestart: () => void }) { return <section className="safety-state enter" role="alert"><div className="completion-mark">!</div><p className="eyebrow centered">Immediate support matters most</p><h1>Pause the ordinary consultation.</h1><p>{message || "If you or someone else may be in immediate danger, contact local emergency services now. In the United States or Canada, call or text 988 for crisis support."}</p><p>Navigator is not an emergency or private professional service.</p><button className="secondary-button" onClick={onRestart}>Clear this consultation</button></section>; }

export default function Home() {
  const [hydrated, setHydrated] = useState(false); const [draft, setDraft] = useState<NavigatorDraft>(EMPTY_DRAFT); const [error, setError] = useState(""); const [analysisStep, setAnalysisStep] = useState(0); const [analysisError, setAnalysisError] = useState(""); const [pendingStage, setPendingStage] = useState<"interpret" | "result">("interpret"); const [precisionSelections, setPrecisionSelections] = useState<string[]>([]);
  useEffect(() => { const saved = loadDraft(window.localStorage); let cancelled = false; queueMicrotask(() => { if (!cancelled) { if (saved) setDraft(saved.screen === "analysis" ? { ...saved, screen: saved.interpretation ? "patterns" : "intention" } : saved); setHydrated(true); } }); return () => { cancelled = true; }; }, []);
  useEffect(() => { if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); }, [draft, hydrated]);
  const selectedHypotheses = useMemo(() => draft.interpretation?.intentionHypotheses.filter((item) => draft.selectedHypothesisIds.includes(item.id)) ?? [], [draft.interpretation, draft.selectedHypothesisIds]);
  const restart = () => { window.localStorage.removeItem(STORAGE_KEY); setDraft({ ...EMPTY_DRAFT }); setError(""); setAnalysisError(""); setPrecisionSelections([]); };

  async function run(stage: "interpret" | "result", clarificationAnswer = "", refinement = "") {
    setPendingStage(stage); setAnalysisError(""); setAnalysisStep(0); setDraft((current) => ({ ...current, screen: "analysis" }));
    const interval = window.setInterval(() => setAnalysisStep((step) => Math.min(step + 1, ANALYSIS_STEPS.length)), 450);
    try {
      const responsePromise = fetch("/api/navigate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stage, intention: draft.intention, selectedHypotheses, correction: refinement || draft.correction, clarificationAnswer, expertiseOverride: draft.expertiseOverride }) }).then(async (response) => { const payload = await response.json() as { data?: unknown; error?: string }; if (!response.ok) throw new Error(payload.error || "Navigator could not complete this step."); return payload.data; });
      const data = await responsePromise;
      if (stage === "interpret") {
        if (!isInterpretation(data)) throw new Error("Navigator returned an incomplete interpretation.");
        setDraft((current) => ({ ...current, interpretation: data, screen: data.urgentRisk ? "safety" : "patterns" }));
      } else {
        if (!isNavigatorResult(data)) throw new Error("Navigator returned an incomplete insight.");
        const hasAnswered = Boolean(clarificationAnswer);
        setDraft((current) => ({ ...current, result: data, clarificationAnswer, screen: data.urgentRisk ? "safety" : data.clarificationNeeded && !hasAnswered ? "clarification" : "result" }));
      }
    } catch (caught) { setAnalysisError(caught instanceof Error ? caught.message : "Navigator encountered a temporary problem."); }
    finally { window.clearInterval(interval); setAnalysisStep(ANALYSIS_STEPS.length); }
  }

  function useDemo() { if (pendingStage === "interpret") setDraft((current) => ({ ...current, interpretation: SAMPLE_INTERPRETATION, screen: "patterns" })); else setDraft((current) => ({ ...current, result: SAMPLE_RESULT, screen: "result" })); setAnalysisError(""); }
  if (!hydrated) return <main className="app-shell" aria-busy="true" />;
  const question = draft.result?.clarificationQuestion;
  return <main className="app-shell"><Header onRestart={restart} showRestart={draft.screen !== "welcome"} /><div className="content-shell">
    {draft.screen === "welcome" && <Welcome onStart={() => setDraft((current) => ({ ...current, screen: "intention" }))} />}
    {draft.screen === "intention" && <Intention value={draft.intention} error={error} onChange={(intention) => { setDraft((current) => ({ ...current, intention })); setError(""); }} onBack={() => setDraft((current) => ({ ...current, screen: "welcome" }))} onSubmit={() => { if (!isMeaningful(draft.intention)) return setError("Share at least a short description so Navigator has something real to interpret."); void run("interpret"); }} />}
    {draft.screen === "analysis" && <Analysis step={analysisStep} error={analysisError} onRetry={() => void run(pendingStage, draft.clarificationAnswer)} onDemo={useDemo} onEdit={() => setDraft((current) => ({ ...current, screen: "intention" }))} />}
    {draft.screen === "patterns" && draft.interpretation && <Patterns draft={draft} error={error} onToggle={(id) => { setError(""); setDraft((current) => ({ ...current, selectedHypothesisIds: current.selectedHypothesisIds.includes(id) ? current.selectedHypothesisIds.filter((item) => item !== id) : id === "none" ? ["none"] : [...current.selectedHypothesisIds.filter((item) => item !== "none"), id] })); }} onCorrection={(correction) => setDraft((current) => ({ ...current, correction }))} onMode={(expertiseOverride) => setDraft((current) => ({ ...current, expertiseOverride }))} onBack={() => setDraft((current) => ({ ...current, screen: "intention" }))} onContinue={() => { if (!draft.selectedHypothesisIds.length) return setError("Select at least one direction or choose “None of these.”"); if (draft.selectedHypothesisIds.includes("none") && !isMeaningful(draft.correction, 3)) return setError("Briefly tell Navigator what the interpretation is missing."); void run("result"); }} />}
    {draft.screen === "clarification" && question && <Clarification question={question} value={draft.clarificationAnswer} selected={precisionSelections} error={error} onValue={(clarificationAnswer) => { setDraft((current) => ({ ...current, clarificationAnswer })); setError(""); }} onChoice={(choice) => { setError(""); setPrecisionSelections((current) => question.answerType === "multiple_choice" ? current.includes(choice) ? current.filter((item) => item !== choice) : [...current, choice] : [choice]); }} onBack={() => setDraft((current) => ({ ...current, screen: "patterns" }))} onSubmit={() => { const combined = [precisionSelections.filter((choice) => choice !== "Something else").join(", "), draft.clarificationAnswer].filter(Boolean).join(" — "); if (!isMeaningful(combined, 2)) return setError("Choose an answer or add a short clarification."); setDraft((current) => ({ ...current, clarificationAnswer: combined })); void run("result", combined); }} />}
    {draft.screen === "result" && draft.result && <Result result={draft.result} refinementUsed={draft.refinementUsed} onReflect={() => setDraft((current) => ({ ...current, screen: "reflection" }))} onRestart={restart} onRefine={(refinement) => { setDraft((current) => ({ ...current, refinementUsed: true, correction: `${current.correction}\nRefinement: ${refinement}` })); void run("result", draft.clarificationAnswer, refinement); }} />}
    {draft.screen === "reflection" && draft.result && <Reflection result={draft.result} onRestart={restart} onResult={() => setDraft((current) => ({ ...current, screen: "result" }))} />}
    {draft.screen === "safety" && <Safety message={draft.result?.safetyMessage || draft.interpretation?.safetyMessage || ""} onRestart={restart} />}
  </div><footer><span>Jones Labs Navigator</span><span>Relevance first. Reality is the final judge.</span></footer></main>;
}
