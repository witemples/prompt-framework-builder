"use client";

import { useState } from "react";

export type IntakeResult = {
  frameworkId: string;
  fields: Record<string, string>;
  why: string;
};

type Props = {
  onGenerate: (r: IntakeResult) => void;
};

export default function NaturalLanguageIntake({ onGenerate }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGenerate() {
    if (!text.trim()) return;
    setLoading(true);

    // --- Heuristic classifier (no API key needed). You can swap this for an /api call later.
    const t = text.toLowerCase();

    // Pick a framework by intent
    let frameworkId = "rtf";
    if (/(plan|rollout|objective|limit|vision|execute)/.test(t)) frameworkId = "solve";
    if (/(define|research|experiment|execute|analy(s|z)e|measure|launch|workshop)/.test(t)) frameworkId = "dream";
    if (/(role|format|table|json|as a)/.test(t)) frameworkId = "rtf";
    if (/(steps|inputs|outputs|workflow|pipeline)/.test(t)) frameworkId = "rise";
    if (/(case|example|story)/.test(t)) frameworkId = "care";
    if (/(trade[- ]?off|constraints|options)/.test(t)) frameworkId = "pact";
    if (/(expect|deliverable|who does what)/.test(t)) frameworkId = "race";
    if (/(quick|task|action|goal)/.test(t)) frameworkId = "tag";

    const fields: Record<string, string> = {};

    // Prefill likely fields based on chosen framework
    if (frameworkId === "solve") {
      fields["situation"] = text;
      fields["objective"] = guessObjective(t) || "State your primary goal.";
      fields["limitations"] = guessLimits(t);
      fields["vision"] = "Describe what 'great' looks like when this works.";
      fields["execution"] = "High-level steps with owners and timeline.";
    } else if (frameworkId === "dream") {
      fields["define"] = text;
      fields["research"] = "List signals, past results, and audience insights you already have.";
      fields["execute"] = "What will we do next (channels, assets, cadence)?";
      fields["analyse"] = "What will we track daily/weekly (leading indicators)?";
      fields["measure"] = "What is the success target and when?";
    } else if (frameworkId === "rtf") {
      fields["role"] = "Act as a senior strategist for this domain.";
      fields["task"] = text;
      fields["format"] = "Bulleted sections with clear headings.";
    } else if (frameworkId === "rise") {
      fields["role"] = "The role running the workflow.";
      fields["inputs"] = "Key inputs required before starting.";
      fields["steps"] = "Step-by-step instructions.";
      fields["expected"] = "Expected outputs and acceptance criteria.";
    } else if (frameworkId === "care") {
      fields["context"] = text;
      fields["action"] = "What was done / approach taken.";
      fields["result"] = "Outcome with concrete metrics if possible.";
      fields["evidence"] = "Data/quotes/links supporting the result.";
    } else if (frameworkId === "pact") {
      fields["problem"] = text;
      fields["alternatives"] = "List 2–3 plausible paths.";
      fields["constraints"] = guessLimits(t);
      fields["tradeoffs"] = "Pros/cons and when to choose each.";
    } else if (frameworkId === "race") {
      fields["role"] = "Who is responsible for the output.";
      fields["action"] = "Exactly what they must do.";
      fields["context"] = text;
      fields["expectation"] = "Definition of done.";
    } else if (frameworkId === "tag") {
      fields["task"] = text;
      fields["action"] = "Immediate steps to complete it.";
      fields["goal"] = "How we'll know it's done.";
    }

    const why = `Chose ${frameworkId.toUpperCase()} based on detected intent/keywords in your description. You can edit any field before copying.`;

    onGenerate({ frameworkId, fields, why });
    setLoading(false);
  }

  return (
    <div className="rounded-2xl border border-neutral-800 p-4 bg-neutral-900/40">
      <label className="text-sm text-neutral-300">Describe your goal in plain English</label>
      <textarea
        className="mt-2 w-full rounded-xl bg-neutral-950 border border-neutral-800 p-3 outline-none"
        rows={4}
        placeholder="e.g., We have a Sept 20 workshop with zero signups; I need a 5-day content plan and funnel steps to hit 25 registrations."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleGenerate}
          disabled={loading || !text.trim()}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-60"
        >
          {loading ? "Thinking…" : "Generate Framework & Prefill"}
        </button>
        <span className="text-xs text-neutral-500">
          This will auto-select a framework and suggest field values.
        </span>
      </div>
    </div>
  );
}

function guessObjective(t: string) {
  const m = t.match(/(increase|grow|hit|reach)\s+([0-9]+%?|[0-9]+)\s*(signups|adoption|sales|mrr|revenue|users)?/);
  if (!m) return "";
  return `Aim to ${m[1]} ${m[2]}${m[3] ? " " + m[3] : ""}.`;
}

function guessLimits(t: string) {
  const bits: string[] = [];
  if (/budget|cost|spend|small budget|low budget/.test(t)) bits.push("Limited budget");
  if (/time|deadline|by\s+(sept|oct|nov|dec|jan|feb|mar|apr|may|jun|jul|aug)|\b\d{1,2}\/\d{1,2}\b/.test(t)) bits.push("Tight timeline");
  if (/no team|solo|one person|limited resources/.test(t)) bits.push("Limited team capacity");
  return bits.length ? bits.join("; ") : "List key constraints (budget, time, team, rules).";
}
