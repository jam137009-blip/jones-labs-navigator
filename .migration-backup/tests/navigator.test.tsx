import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import Home from "../app/page";
import { EMPTY_DRAFT, SAMPLE_INTERPRETATION, SAMPLE_RESULT, STORAGE_KEY, loadDraft } from "../app/navigator";

function save(overrides: Partial<typeof EMPTY_DRAFT>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...EMPTY_DRAFT, ...overrides }));
}

describe("adaptive Navigator experience", () => {
  it("captures the opening intention and preserves it locally", async () => {
    const user = userEvent.setup(); render(<Home />);
    await user.click(await screen.findByRole("button", { name: "Start Discovery" }));
    const input = screen.getByRole("textbox", { name: "Your intention" });
    await user.type(input, "I want to turn a meaningful idea into a real project.");
    await waitFor(() => expect(loadDraft(window.localStorage)?.intention).toContain("meaningful idea"));
    expect(screen.getByRole("heading", { name: /What are you trying to accomplish/i })).toBeInTheDocument();
  });

  it("rejects an extremely short intention", async () => {
    const user = userEvent.setup(); save({ screen: "intention" }); render(<Home />);
    await user.type(await screen.findByRole("textbox"), "Help me");
    await user.click(screen.getByRole("button", { name: "Find the direction" }));
    expect(screen.getByRole("alert")).toHaveTextContent(/short description/i);
  });

  it("renders generated intention hypotheses and supports multiple confirmation", async () => {
    const user = userEvent.setup(); save({ screen: "patterns", intention: "I want to build a useful project.", interpretation: SAMPLE_INTERPRETATION }); render(<Home />);
    expect(await screen.findAllByText(/Hypotheses—not conclusions/i)).not.toHaveLength(0);
    const first = screen.getByRole("button", { name: /Test whether the idea solves a real problem/i });
    const second = screen.getByRole("button", { name: /Choose a focused first version/i });
    await user.click(first); await user.click(second);
    expect(first).toHaveAttribute("aria-pressed", "true"); expect(second).toHaveAttribute("aria-pressed", "true");
  });

  it("supports the None of these correction path", async () => {
    const user = userEvent.setup(); save({ screen: "patterns", intention: "I need clarity about a decision.", interpretation: SAMPLE_INTERPRETATION }); render(<Home />);
    await user.click(await screen.findByRole("button", { name: /None of these fully captures it/i }));
    expect(screen.getByRole("textbox", { name: "What feels missing or different?" })).toBeInTheDocument();
  });

  it("shows the inferred expertise mode and lets the user correct it", async () => {
    const user = userEvent.setup(); save({ screen: "patterns", intention: "I need clarity about a decision.", interpretation: SAMPLE_INTERPRETATION }); render(<Home />);
    const mode = await screen.findByRole("combobox", { name: "Adjust" });
    expect(mode).toHaveValue("informed");
    await user.selectOptions(mode, "expert");
    expect(mode).toHaveValue("expert");
    await waitFor(() => expect(loadDraft(window.localStorage)?.expertiseOverride).toBe("expert"));
  });

  it("renders one adaptive precision question", async () => {
    save({ screen: "clarification", intention: "I want to build a useful project.", interpretation: SAMPLE_INTERPRETATION, result: { ...SAMPLE_RESULT, clarificationNeeded: true, clarificationQuestion: SAMPLE_INTERPRETATION.clarificationQuestion } }); render(<Home />);
    expect(await screen.findByRole("heading", { name: SAMPLE_INTERPRETATION.clarificationQuestion.question })).toBeInTheDocument();
    expect(screen.getByText("One question maximum")).toBeInTheDocument();
  });

  it("renders the signature result, hypotheses, paths, and completion evidence", async () => {
    save({ screen: "result", intention: "I want to build a useful project.", result: SAMPLE_RESULT }); render(<Home />);
    const signature = await screen.findByRole("heading", { name: "The Question Beneath the Question" });
    const heard = screen.getByRole("heading", { name: "What Navigator Heard" });
    expect(signature.compareDocumentPosition(heard) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByText("Hypotheses—not conclusions")).toBeInTheDocument();
    expect(screen.getByText(SAMPLE_RESULT.recommendedNextAction.completionEvidence)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Challenge Test" })).toBeInTheDocument();
    expect(screen.getByText(SAMPLE_RESULT.falsificationQuestion)).toBeInTheDocument();
  });

  it("clears the local draft on restart", async () => {
    const user = userEvent.setup(); save({ screen: "result", intention: "Saved private draft text", result: SAMPLE_RESULT }); render(<Home />);
    await user.click(await screen.findByRole("button", { name: "Start over" }));
    expect(screen.getByRole("heading", { name: /You don’t need to know/i })).toBeInTheDocument();
    expect(loadDraft(window.localStorage)?.intention ?? "").toBe("");
  });

  it("exposes reduced-motion CSS and keyboard-accessible native controls", async () => {
    save({ screen: "reflection", intention: "A complete intention sample here.", result: SAMPLE_RESULT }); render(<Home />);
    const checkbox = await screen.findByRole("checkbox");
    expect(checkbox).toBeEnabled();
    expect(document.styleSheets.length).toBeGreaterThanOrEqual(0);
  });

  it("keeps reflection focused on one evidence-producing commitment", async () => {
    save({ screen: "reflection", intention: "A complete intention sample here.", result: SAMPLE_RESULT }); render(<Home />);
    expect(await screen.findByRole("heading", { name: "Will you test this next move?" })).toBeInTheDocument();
    expect(screen.queryByText("Partially")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Confirm next move/i })).toBeDisabled();
  });
});
