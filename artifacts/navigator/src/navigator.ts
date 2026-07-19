export const STORAGE_KEY = "jones-labs-navigator-adaptive-v2";

export type ExpertiseMode = "exploratory" | "informed" | "expert";

export type Hypothesis = {
  id: string;
  label: string;
  description: string;
  confidence: number;
};

export type PrecisionQuestion = {
  question: string;
  reason: string;
  answerType: "single_choice" | "multiple_choice" | "free_text";
  choices: string[];
};

export type Interpretation = {
  inferredExpertiseMode: ExpertiseMode;
  expertiseEvidence: string;
  interpretedIntention: string;
  intentionHypotheses: Hypothesis[];
  explicitFacts: string[];
  greatestRemainingUncertainty: string;
  clarificationNeeded: boolean;
  clarificationQuestion: PrecisionQuestion;
  sufficiencyReached: boolean;
  urgentRisk: boolean;
  safetyMessage: string;
  limitations: string;
};

export type Assumption = {
  hypothesis: string;
  support: string;
  uncertainty: string;
};

export type DecisionPath = {
  title: string;
  description: string;
  benefit: string;
  tradeoff: string;
};

export type NavigatorResult = {
  expertiseMode: ExpertiseMode;
  questionBeneathTheQuestion: string;
  interpretedIntention: string;
  currentReality: string;
  desiredReality: string;
  primaryConstraint: string;
  assumptionsWorthTesting: Assumption[];
  decisionPaths: DecisionPath[];
  recommendedNextAction: {
    action: string;
    whyThisAction: string;
    completionEvidence: string;
  };
  confidence: "low" | "medium" | "high";
  whatCouldChangeThisInterpretation: string;
  evidenceGaps: string[];
  falsificationQuestion: string;
  secondOrderEffects: string[];
  limitations: string;
  clarificationNeeded: boolean;
  clarificationQuestion: PrecisionQuestion;
  sufficiencyReached: boolean;
  urgentRisk: boolean;
  safetyMessage: string;
};

export type Screen = "welcome" | "intention" | "patterns" | "analysis" | "clarification" | "result" | "reflection" | "safety";

export type NavigatorDraft = {
  screen: Screen;
  intention: string;
  interpretation: Interpretation | null;
  selectedHypothesisIds: string[];
  correction: string;
  clarificationAnswer: string;
  result: NavigatorResult | null;
  refinementUsed: boolean;
  expertiseOverride: ExpertiseMode | null;
};

export const EMPTY_DRAFT: NavigatorDraft = {
  screen: "welcome",
  intention: "",
  interpretation: null,
  selectedHypothesisIds: [],
  correction: "",
  clarificationAnswer: "",
  result: null,
  refinementUsed: false,
  expertiseOverride: null,
};

export const SAMPLE_INTERPRETATION: Interpretation = {
  inferredExpertiseMode: "informed",
  expertiseEvidence: "The intention distinguishes validation, scope, and commitment but does not rely on specialist terminology.",
  interpretedIntention: "You want to turn a meaningful idea into a focused project and learn which direction deserves commitment.",
  intentionHypotheses: [
    { id: "validate", label: "Test whether the idea solves a real problem", description: "You may want evidence from the people the project is meant to help.", confidence: 0.84 },
    { id: "focus", label: "Choose a focused first version", description: "You may be trying to reduce a broad vision to something you can actually begin.", confidence: 0.78 },
    { id: "commit", label: "Build confidence through action", description: "You may need real-world learning more than another round of planning.", confidence: 0.7 },
  ],
  explicitFacts: ["The user has an idea they care about.", "The user wants to turn it into a real project."],
  greatestRemainingUncertainty: "Whether the immediate need is validation, focus, or commitment.",
  clarificationNeeded: true,
  clarificationQuestion: {
    question: "What would make the most progress: evidence from potential users, a focused first version, or real-world learning through action?",
    reason: "The answer changes whether Navigator emphasises validation, scope reduction, or early experiments.",
    answerType: "single_choice",
    choices: ["Evidence from potential users", "A focused, buildable first version", "Learning by starting something real", "Something else"],
  },
  sufficiencyReached: false,
  urgentRisk: false,
  safetyMessage: "",
  limitations: "This interpretation is based solely on the words you provided. Navigator may have missed context only you can see.",
};

export const SAMPLE_RESULT: NavigatorResult = {
  expertiseMode: "informed",
  questionBeneathTheQuestion: "What is the smallest real-world action that would either validate this idea or reveal the most important flaw in it?",
  interpretedIntention: "You want to turn a meaningful idea into a project worth committing to, starting with the direction most likely to produce useful learning.",
  currentReality: "You have an idea you care about and have not yet taken a committed first step. The path from idea to real project has not yet been chosen.",
  desiredReality: "A clear, scoped first version of the project exists or is underway, and you have enough evidence to know whether continued investment makes sense.",
  primaryConstraint: "Uncertainty about which direction—validate, focus, or begin—would produce the most useful learning with the least risk of wasted effort.",
  assumptionsWorthTesting: [
    { hypothesis: "Talking to potential users will reveal whether the idea addresses a real problem.", support: "User research typically surfaces needs and blockers invisible at the idea stage.", uncertainty: "The right people to talk to may be hard to reach, and users often cannot articulate latent needs." },
    { hypothesis: "A focused first version will be small enough to begin without resolving all open questions.", support: "Scoping to a single core capability reduces decision paralysis and produces something testable.", uncertainty: "It may be unclear what the minimum scope is without first knowing what users actually value." },
    { hypothesis: "Starting something real will reveal constraints faster than planning would.", support: "Early action often surfaces technical, resource, or market constraints that are invisible in theory.", uncertainty: "Acting without a hypothesis risks effort that cannot be connected to any useful learning." },
  ],
  decisionPaths: [
    { title: "Validate first", description: "Spend one to two weeks talking to five potential users before building anything.", benefit: "Reveals whether the problem is real and what form a solution should take.", tradeoff: "Requires recruiting and scheduling; findings may still be ambiguous." },
    { title: "Scope and begin", description: "Define the single most important feature and build a minimal working version.", benefit: "Produces something real quickly; clarifies technical and scope constraints through action.", tradeoff: "Risk of building the wrong thing if the core problem is not yet confirmed." },
    { title: "Run a one-week experiment", description: "Define one hypothesis, design the simplest test, and execute it within a week.", benefit: "Balances learning and action; forces a clear hypothesis before investment.", tradeoff: "Requires discipline to keep the experiment truly minimal." },
  ],
  recommendedNextAction: {
    action: "Write one sentence describing the specific problem your idea solves and one sentence describing who has that problem. Share it with two people who might have the problem and record their unedited responses.",
    whyThisAction: "This produces the minimum evidence needed to decide whether validation, focus, or action is the right next step—without committing to any of them prematurely.",
    completionEvidence: "You have two written responses from real people, and you can say whether their reactions increased or decreased your confidence in the idea.",
  },
  confidence: "medium",
  whatCouldChangeThisInterpretation: "If you already have evidence that the problem is real, the focus-and-begin path becomes more appropriate. If you have no time for user conversations, a scoped experiment is better than open-ended validation.",
  limitations: "This insight is based on one short description. It cannot account for your existing knowledge, resources, constraints, or prior attempts. Treat it as a starting point, not a conclusion.",
  evidenceGaps: ["Whether the problem is experienced by more than a small number of people", "Whether you have skills or access needed to execute any of the three paths", "Whether an existing solution already addresses the problem adequately"],
  falsificationQuestion: "If you talked to five potential users and none of them described experiencing the problem, would you still pursue this idea?",
  secondOrderEffects: ["Early user conversations may reveal a better problem adjacent to the one you identified.", "A minimal first version may attract collaborators or early users who change the project's direction."],
  clarificationNeeded: false,
  clarificationQuestion: { question: "", reason: "", answerType: "free_text", choices: [] },
  sufficiencyReached: true,
  urgentRisk: false,
  safetyMessage: "",
};

export function isMeaningful(text: string, minWords = 5): boolean {
  return text.trim().split(/\s+/).filter(Boolean).length >= minWords;
}

export function isInterpretation(value: unknown): value is Interpretation {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.interpretedIntention === "string"
    && ["exploratory", "informed", "expert"].includes(String(item.inferredExpertiseMode))
    && typeof item.expertiseEvidence === "string"
    && Array.isArray(item.intentionHypotheses)
    && item.intentionHypotheses.length >= 3
    && item.intentionHypotheses.every((hypothesis) => {
      if (!hypothesis || typeof hypothesis !== "object") return false;
      const h = hypothesis as Record<string, unknown>;
      return typeof h.id === "string" && typeof h.label === "string" && typeof h.description === "string" && typeof h.confidence === "number";
    })
    && Array.isArray(item.explicitFacts)
    && typeof item.greatestRemainingUncertainty === "string"
    && typeof item.clarificationNeeded === "boolean"
    && isPrecisionQuestion(item.clarificationQuestion)
    && typeof item.sufficiencyReached === "boolean"
    && typeof item.urgentRisk === "boolean"
    && typeof item.safetyMessage === "string"
    && typeof item.limitations === "string";
}

export function isPrecisionQuestion(value: unknown): value is PrecisionQuestion {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.question === "string"
    && typeof item.reason === "string"
    && ["single_choice", "multiple_choice", "free_text"].includes(String(item.answerType))
    && Array.isArray(item.choices)
    && item.choices.every((choice) => typeof choice === "string");
}

export function isNavigatorResult(value: unknown): value is NavigatorResult {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  const action = item.recommendedNextAction as Record<string, unknown> | undefined;
  return ["questionBeneathTheQuestion", "interpretedIntention", "currentReality", "desiredReality", "primaryConstraint", "whatCouldChangeThisInterpretation", "falsificationQuestion", "limitations", "safetyMessage"].every((key) => typeof item[key] === "string")
    && ["exploratory", "informed", "expert"].includes(String(item.expertiseMode))
    && Array.isArray(item.evidenceGaps)
    && Array.isArray(item.secondOrderEffects)
    && Array.isArray(item.assumptionsWorthTesting)
    && Array.isArray(item.decisionPaths)
    && item.decisionPaths.length <= 3
    && action != null
    && typeof action.action === "string"
    && typeof action.whyThisAction === "string"
    && typeof action.completionEvidence === "string"
    && ["low", "medium", "high"].includes(String(item.confidence))
    && typeof item.clarificationNeeded === "boolean"
    && isPrecisionQuestion(item.clarificationQuestion)
    && typeof item.sufficiencyReached === "boolean"
    && typeof item.urgentRisk === "boolean";
}

export function loadDraft(storage: Pick<Storage, "getItem">): NavigatorDraft | null {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const value = JSON.parse(raw) as NavigatorDraft;
    const screens: Screen[] = ["welcome", "intention", "patterns", "analysis", "clarification", "result", "reflection", "safety"];
    if (!screens.includes(value.screen) || typeof value.intention !== "string" || value.intention.length > 4000) return null;
    return {
      ...EMPTY_DRAFT,
      ...value,
      interpretation: isInterpretation(value.interpretation) ? value.interpretation : null,
      result: isNavigatorResult(value.result) ? value.result : null,
      selectedHypothesisIds: Array.isArray(value.selectedHypothesisIds) ? value.selectedHypothesisIds.filter((id): id is string => typeof id === "string") : [],
      expertiseOverride: ["exploratory", "informed", "expert"].includes(String(value.expertiseOverride)) ? value.expertiseOverride as ExpertiseMode : null,
    };
  } catch {
    return null;
  }
}
