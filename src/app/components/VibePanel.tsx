"use client";

import { useMemo, useState } from "react";

type ModelKey = "gpt" | "claude" | "llama" | "gemini";
type VibeKey =
  | "neutral"
  | "friendly"
  | "analytical"
  | "persuasive"
  | "coach"
  | "creative";

const MODELS: Record<ModelKey, { label: string }> = {
  gpt: { label: "OpenAI (GPT-4.x / 4o / mini)" },
  claude: { label: "Anthropic Claude 3.x" },
  llama: { label: "Llama 3.x (Meta)" },
  gemini: { label: "Google Gemini 1.5" },
};

const VIBES: Record<VibeKey, { label: string; bullets: string[] }> = {
  neutral: {
    label: "Neutral / Concise",
    bullets: [
      "Be concise and unambiguous.",
      "Use plain language and short sentences.",
      "No fluff; only essential content.",
    ],
  },
  friendly: {
    label: "Friendly / Motivational",
    bullets: [
      "Warm, positive tone.",
      "Encourage the reader with clear next steps.",
      "Keep it human—avoid stiff phrasing.",
    ],
  },
  analytical: {
    label: "Analytical / Data-driven",
    bullets: [
      "Structure with headings and bullet points.",
      "Cite assumptions; quantify when possible.",
      "Highlight risks, trade-offs, and rationale.",
    ],
  },
  persuasive: {
    label: "Persuasive / Sales",
    bullets: [
      "Lead with outcome and value.",
      "Address objections proactively.",
      "End with a clear, specific CTA.",
    ],
  },
  coach: {
    label: "Educational Coach",
    bullets: [
      "Explain step by step.",
      "Use simple examples and analogies.",
      "Invite questions; check understanding.",
    ],
  },
  creative: {
    label: "Creative / Storyteller",
    bullets: [
      "Evocative imagery and varied cadence.",
      "Show, don’t tell. Avoid clichés.",
      "Keep a consistent narrative voice.",
    ],
  },
};

// Model-specific wrappers the user can paste into *system* or top-of-prompt.
function renderForModel(model: ModelKey, vibe: VibeKey) {
  const items = VIBES[vibe].bullets.map((b) => `- ${b}`).join("\n");
  switch (model) {
    case "gpt":
      return `SYSTEM:\nYou are an expert assistant. Apply this style:\n${items}\n\nStrictly follow the style unless the user opts out.`;
    case "claude":
      // Claude supports a `system` string; this mirrors that content.
      return `Claude System Prompt:\nYou are an expert assistant. Style guidelines:\n${items}\n\nFollow these unless the user opts out.`;
    case "llama":
      return `System (Llama):\nYou are an expert assistant.\nStyle:\n${items}\n\nComply strictly unless instructed otherwise.`;
    case "gemini":
      return `system_instruction (Gemini):\nYou are an expert assistant. Use the following style:\n${items}\n\nAdhere to this style unless the user opts out.`;
  }
}

export default function VibePanel({
  onChange,
}: {
  // Optional: if you want to automatically prepend to your Preview
  onChange?: (snippet: string) => void;
}) {
  const [model, setModel] = useState<ModelKey>("gpt");
  const [vibe, setVibe] = useState<VibeKey>("neutral");
  const [prepend, setPrepend] = useState<boolean>(false);

  const snippet = useMemo(() => renderForModel(model, vibe), [model, vibe]);

  // Notify parent when toggled to prepend (optional integration)
  useMemo(() => {
    if (onChange) onChange(prepend ? snippet : "");
  }, [prepend, snippet, onChange]);

  function copy() {
    navigator.clipboard.writeText(snippet);
  }

  return (
    <div className="mb-6 rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div>
            <label className="text-xs text-neutral-400">Model</label>
            <select
              className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
              value={model}
              onChange={(e) => setModel(e.target.value as ModelKey)}
            >
              {Object.entries(MODELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-neutral-400">Vibe</label>
            <select
              className="mt-1 w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm"
              value={vibe}
              onChange={(e) => setVibe(e.target.value as VibeKey)}
            >
              {Object.entries(VIBES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <label className="mt-6 inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={prepend}
              onChange={(e) => setPrepend(e.target.checked)}
            />
            Prepend to Preview
          </label>
        </div>

        <div className="shrink-0">
          <button
            onClick={copy}
            className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold hover:bg-emerald-500"
          >
            Copy Vibe Code
          </button>
        </div>
      </div>

      <div className="mt-3">
        <label className="text-xs text-neutral-400">Vibe Code</label>
        <textarea
          className="mt-1 h-40 w-full resize-y rounded-lg border border-neutral-700 bg-neutral-950 p-3 text-sm font-mono"
          value={snippet}
          readOnly
        />
      </div>
    </div>
  );
}
