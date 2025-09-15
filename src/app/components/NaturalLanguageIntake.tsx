"use client";

import { useState } from "react";

export type IntakeResult = {
  bestId: string;
  why: string;
  scores: Record<string, number>;
  fieldsById: Record<string, Record<string, string>>;
};

type Props = { onGenerate: (r: IntakeResult) => void };

export default function NaturalLanguageIntake({ onGenerate }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  function score(t: string, patterns: (RegExp | string)[]) {
    const s = t.toLowerCase();
    let total = 0;
    for (const p of patterns) {
      const re = typeof p === "string" ? new RegExp(`\\b${p}\\b`, "gi") : p;
      const matches = s.match(re);
      total += matches ? matches.length : 0;
    }
    return total;
  }

  function buildAll(t: string) {
    const fieldsById: Record<string, Record<string, string>> = {};

    // RTF
    fieldsById["rtf"] = {
      role: "Act as a senior strategist for this domain.",
      task: text,
      format: "Bulleted sections with clear headings.",
    };

    // SOLVE
    fieldsById["solve"] = {
      situation: text,
      objective: guessObjective(t) || "State the primary goal.",
      limitations: guessLimits(t),
      vision: "Describe what 'great' looks like when this works.",
      execution: "High-level steps with owners and timeline.",
    };

    // DREAM
    fieldsById["dream"] = {
      define: text,
      research: "List signals, past results, and audience insights you already have.",
      execute: "What will we do next (channels, assets, cadence)?",
      analyse: "What will we track (leading indicators)?",
      measure: "What is the success target and when?",
    };

    // RISE
    fieldsById["rise"] = {
      role: "The role running the workflow.",
      input: "Key inputs required before starting.",
      steps: "Step-by-step instructions.",
      expectation: "Expected outputs and acceptance criteria.",
    };

    // CARE
    fieldsById["care"] = {
      context: text,
      action: "What was done / approach taken.",
      result: "Outcome with concrete metrics if possible.",
      example: "A concise illustration or snippet.",
    };

    // PACT
    fieldsById["pact"] = {
      problem: text,
      approach: "List 2–3 plausible paths.",
      compromise: "Tradeoffs/risks to consider.",
      test: "How we’ll validate quickly.",
    };

    // RACE
    fieldsById["race"] = {
      role: "Who is responsible for the output.",
      action: "Exactly what they must do.",
      context: text,
      expectation: "Definition of done.",
    };

    // TAG
    fieldsById["tag"] = {
      task: text,
      action: "Immediate steps to complete it.",
      goal: "How we'll know it's done.",
    };

    // Scoring (count keyword hits). Tune as you like.
    const patterns: Record<string, (RegExp | string)[]> = {
      rtf: [/role|format|table|json|as a/gi, "brief", "rewrite"],
      solve: [/plan|rollout|objective|limit|vision|execute/gi],
      dream: [/define|research|experiment|execute|analy(s|z)e|measure|launch|workshop/gi],
      rise: [/steps|inputs?|outputs?|workflow|pipeline/gi],
      care: [/case|example|story/gi],
      pact: [/trade[- ]?off|constraints?|options?/gi],
      race: [/expect|deliverable|who does what/gi],
      tag: [/quick|task|action|goal/gi],
    };

    const scores: Record<string, number> = {};
    for (const id of Object.keys(fieldsById)) {
      scores[id] = score(t, patterns[id] || []);
    }

    // Tie-breaker preference order if all zero or draw
    const order = ["solve", "dream", "rtf", "rise", "tag", "race", "pact", "care"];
    let bestId = order[0];
    let bestScore = -1;
    for (const id of Object.keys(scores)) {
      if (scores[id] > bestScore || (scores[id] === bestScore && order.indexOf(id) < order.indexOf(bestId))) {
        bestId = id;
        bestScore = scores[id];
      }
    }

    const why = bestScore > 0
      ? `Recommended ${bestId.toUpperCase()} based on detected keywords (${bestScore} matches).`
      : `Recommended ${bestId.toUpperCase()} as a sensible default for planning/structure.`;

    return { fieldsById, scores, bestId, why };
  }

  async function handleGenerate() {
    if (!text.trim()) return;
    setLoading(true);
    const { fieldsById, scores, bestId, why } = buildAll(text.toLowerCase());
    onGenerate({ bestId, why, scores, fieldsById });
    setLoading(false);
  }

  return (
    <div className="rounded-2xl border border-neutral-800 p-4 bg-neutral-900/40">
      <label className="text-sm text-neutral-300">Describe your goal in plain English</label>
      <textarea
        className="mt-2 w-full rounded-xl bg-neutral-950 border border-neutral-800 p-3 outline-none"
        rows={4}
        placeholder="e.g., We have a Sept 20 workshop with low signups; I need a 5-day plan and funnel to hit 25 registrations."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="mt-3 flex items-center gap-3">
        <button
          onClick={handleGenerate}
          disabled={loading || !text.trim()}
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500 disabled:opacity-60"
        >
          {loading ? "Thinking…" : "Suggest Frameworks & Prefill"}
        </button>
        <span className="text-xs text-neutral-500">Scores every framework, pre-fills fields, and recommends one.</span>
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
