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
  clarificationQuestion: { question: "What would be the most valuable evidence for you to have 30 days from now?", reason: "This distinguishes between validation, scope, and execution as the primary constraint.", answerType: "single_choice", choices: ["A real person wants the solution", "A small version is working", "I have chosen one direction", "Something else"] },
  sufficiencyReached: false,
  urgentRisk: false,
  safetyMessage: "",
  limitations: "This is an initial interpretation based on one intention sample.",
};

export const SAMPLE_RESULT: NavigatorResult = {
  expertiseMode: "informed",
  questionBeneathTheQuestion: "What is the smallest real-world test that would give me evidence—rather than reassurance—about which direction deserves my commitment?",
  interpretedIntention: "Turn a meaningful idea into a focused project that can be tested with the people it is meant to help.",
  currentReality: "You have a motivating vision and several possible directions, but the first version has not yet been tested in reality.",
  desiredReality: "A small, credible version is in front of a real person, creating evidence about what deserves to grow.",
  primaryConstraint: "The pressure to choose the perfect long-term direction before running a small short-term test.",
  assumptionsWorthTesting: [
    { hypothesis: "You may be assuming the first version must represent the full vision.", support: "Your intention emphasizes making the idea real while still choosing its direction.", uncertainty: "A smaller version may be enough to produce the evidence you need." },
    { hypothesis: "One hypothesis worth testing is that more planning will create the missing confidence.", support: "The current gap is between intention and real-world evidence.", uncertainty: "Confidence may come faster from one bounded test." },
  ],
  decisionPaths: [
    { title: "Problem interview", description: "Show the problem statement to one intended user before building.", benefit: "Fast evidence about relevance.", tradeoff: "It tests demand, not the complete experience." },
    { title: "Smallest useful prototype", description: "Build only the moment that creates the core value.", benefit: "Makes the idea concrete.", tradeoff: "Requires cutting attractive features." },
  ],
  recommendedNextAction: { action: "Write a one-paragraph description of the smallest useful version and show it to one person who experiences the problem within 48 hours.", whyThisAction: "It tests the leading uncertainty without requiring the full project.", completionEvidence: "You record what the person expected, what they found useful, and the one change their reaction suggests." },
  confidence: "medium",
  whatCouldChangeThisInterpretation: "Evidence that the main barrier is time, money, access, or another external constraint rather than uncertainty about direction.",
  evidenceGaps: ["No direct response from an intended user has been observed yet."],
  falsificationQuestion: "What evidence would show that validation is not the primary uncertainty?",
  secondOrderEffects: ["A narrowly scoped test may reveal a different user or problem than the original vision assumed."],
  limitations: "This is Navigator’s best interpretation from the information supplied; it is not a conclusion about you or professional advice.",
  clarificationNeeded: false,
  clarificationQuestion: { question: "", reason: "", answerType: "free_text", choices: [] },
  sufficiencyReached: true,
  urgentRisk: false,
  safetyMessage: "",
};

export function isMeaningful(value: string, minimumWords = 4) {
  return value.trim().split(/\s+/).filter(Boolean).length >= minimumWords;
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
      expertiseOverride: ["exploratory", "informed", "expert"].includes(String(value.expertiseOverride)) ? value.expertiseOverride : null,
    };
  } catch {
    return null;
  }
}
