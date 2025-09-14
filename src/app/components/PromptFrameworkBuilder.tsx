"use client";
import React, { useMemo, useState } from "react";

// 8-in-1 Prompt Framework Builder
// Troy — this single-file React tool lets you pick a framework (RTF, SOLVE, TAG, RACE, DREAM, PACT, CARE, RISE),
// fill the fields, and instantly generate a clean, copy‑ready prompt. No backend required.

// ---------- Types ----------

 type FrameworkField = { key: string; label: string; placeholder?: string; helper?: string };
 type Framework = {
  id: string;
  name: string;
  tagline: string;
  color: string; // Tailwind class for accent
  fields: FrameworkField[];
  template: (v: Record<string, string>, extras: Extras) => string;
 };
 type Extras = {
  audience?: string;
  tone?: string;
  length?: string;
  style?: string;
  constraints?: string;
 };

// ---------- Frameworks ----------
const frameworks: Framework[] = [
  {
    id: "rtf",
    name: "R‑T‑F",
    tagline: "Role · Task · Format",
    color: "bg-emerald-600",
    fields: [
      { key: "role", label: "Role", placeholder: "Act as… (e.g., brand strategist)" },
      { key: "task", label: "Task", placeholder: "Do… (e.g., write a messaging hierarchy)" },
      { key: "format", label: "Format", placeholder: "Output as… (e.g., bullets, table, JSON)" },
    ],
    template: (v, e) => `You are to act in the following role and produce the specified output.\n\nRole: ${v.role || ""}\nTask: ${v.task || ""}\nFormat: ${v.format || ""}${commonExtras(e)}`,
  },
  {
    id: "solve",
    name: "S‑O‑L‑V‑E",
    tagline: "Situation · Objective · Limitations · Vision · Execution",
    color: "bg-amber-600",
    fields: [
      { key: "situation", label: "Situation", placeholder: "Context / scenario" },
      { key: "objective", label: "Objective", placeholder: "Primary goal(s)" },
      { key: "limitations", label: "Limitations", placeholder: "Constraints, budgets, rules" },
      { key: "vision", label: "Vision", placeholder: "What great looks like" },
      { key: "execution", label: "Execution", placeholder: "Plan / steps / owners" },
    ],
    template: (v, e) => `Use the SOLVE framework to respond.\n\nSituation: ${v.situation || ""}\nObjective: ${v.objective || ""}\nLimitations: ${v.limitations || ""}\nVision: ${v.vision || ""}\nExecution: ${v.execution || ""}${commonExtras(e)}`,
  },
  {
    id: "tag",
    name: "T‑A‑G",
    tagline: "Task · Action · Goal",
    color: "bg-indigo-600",
    fields: [
      { key: "task", label: "Task", placeholder: "Define the task" },
      { key: "action", label: "Action", placeholder: "What actions to take" },
      { key: "goal", label: "Goal", placeholder: "Success criteria" },
    ],
    template: (v, e) => `Task: ${v.task || ""}\nAction: ${v.action || ""}\nGoal: ${v.goal || ""}${commonExtras(e)}`,
  },
  {
    id: "race",
    name: "R‑A‑C‑E",
    tagline: "Role · Action · Context · Expectation",
    color: "bg-cyan-600",
    fields: [
      { key: "role", label: "Role", placeholder: "Who the AI should be" },
      { key: "action", label: "Action", placeholder: "What to do" },
      { key: "context", label: "Context", placeholder: "Background info" },
      { key: "expectation", label: "Expectation", placeholder: "Definition of done" },
    ],
    template: (v, e) => `Role: ${v.role || ""}\nAction: ${v.action || ""}\nContext: ${v.context || ""}\nExpectation: ${v.expectation || ""}${commonExtras(e)}`,
  },
  {
    id: "dream",
    name: "D‑R‑E‑A‑M",
    tagline: "Define · Research · Execute · Analyse · Measure",
    color: "bg-rose-600",
    fields: [
      { key: "define", label: "Define", placeholder: "Problem / context" },
      { key: "research", label: "Research", placeholder: "Insights or data sources" },
      { key: "execute", label: "Execute", placeholder: "Plan to implement" },
      { key: "analyse", label: "Analyse", placeholder: "How to evaluate results" },
      { key: "measure", label: "Measure", placeholder: "Metrics / instrumentation" },
    ],
    template: (v, e) => `Use DREAM to structure the response.\n\nDefine: ${v.define || ""}\nResearch: ${v.research || ""}\nExecute: ${v.execute || ""}\nAnalyse: ${v.analyse || ""}\nMeasure: ${v.measure || ""}${commonExtras(e)}`,
  },
  {
    id: "pact",
    name: "P‑A‑C‑T",
    tagline: "Problem · Approach · Compromise · Test",
    color: "bg-fuchsia-600",
    fields: [
      { key: "problem", label: "Problem", placeholder: "What needs solving" },
      { key: "approach", label: "Approach", placeholder: "Method(s) to try" },
      { key: "compromise", label: "Compromise", placeholder: "Tradeoffs / risks" },
      { key: "test", label: "Test", placeholder: "How we’ll validate" },
    ],
    template: (v, e) => `Problem: ${v.problem || ""}\nApproach: ${v.approach || ""}\nCompromise: ${v.compromise || ""}\nTest: ${v.test || ""}${commonExtras(e)}`,
  },
  {
    id: "care",
    name: "C‑A‑R‑E",
    tagline: "Context · Action · Result · Example",
    color: "bg-sky-700",
    fields: [
      { key: "context", label: "Context", placeholder: "Background details" },
      { key: "action", label: "Action", placeholder: "Steps to take" },
      { key: "result", label: "Result", placeholder: "Expected outcome" },
      { key: "example", label: "Example", placeholder: "Concrete illustration" },
    ],
    template: (v, e) => `Context: ${v.context || ""}\nAction: ${v.action || ""}\nResult: ${v.result || ""}\nExample: ${v.example || ""}${commonExtras(e)}`,
  },
  {
    id: "rise",
    name: "R‑I‑S‑E",
    tagline: "Role · Input · Steps · Expectation",
    color: "bg-violet-700",
    fields: [
      { key: "role", label: "Role", placeholder: "e.g., Commercial director" },
      { key: "input", label: "Input", placeholder: "What data you receive" },
      { key: "steps", label: "Steps", placeholder: "Process to follow" },
      { key: "expectation", label: "Expectation", placeholder: "What success looks like" },
    ],
    template: (v, e) => `Role: ${v.role || ""}\nInput: ${v.input || ""}\nSteps: ${v.steps || ""}\nExpectation: ${v.expectation || ""}${commonExtras(e)}`,
  },
];

function commonExtras(e: Extras): string {
  const bits: string[] = [];
  if (e?.audience) bits.push(`Intended audience: ${e.audience}`);
  if (e?.tone) bits.push(`Tone/voice: ${e.tone}`);
  if (e?.length) bits.push(`Target length: ${e.length}`);
  if (e?.style) bits.push(`Style/formatting preferences: ${e.style}`);
  if (e?.constraints) bits.push(`Additional constraints: ${e.constraints}`);
  return bits.length ? `\n\nAdditional Guidance:\n- ${bits.join("\n- ")}` : "";
}

// ---------- UI ----------
export default function PromptFrameworkBuilder() {
  const [selectedId, setSelectedId] = useState<Framework["id"]>("rtf");
  const [values, setValues] = useState<Record<string, string>>({});
  const [extras, setExtras] = useState<Extras>({});
  const [customTitle, setCustomTitle] = useState("");

  const fw = useMemo(() => frameworks.find(f => f.id === selectedId)!, [selectedId]);

  const output = useMemo(() => fw.template(values, extras), [fw, values, extras]);

  function resetAll() {
    setValues({});
    setExtras({});
    setCustomTitle("");
  }

  async function copy() {
    try { await navigator.clipboard.writeText(output); alert("Copied to clipboard ✔"); } catch {}
  }

  function download() {
    const title = customTitle || `${fw.name}-prompt`;
    const blob = new Blob([`# ${title}\n\n${output}`], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${slugify(title)}.md`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Prompt Framework Builder</h1>
            <p className="text-neutral-400">Pick a framework, fill the fields, and generate a copy‑ready prompt.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={resetAll} className="rounded-xl bg-neutral-800 px-4 py-2 text-sm hover:bg-neutral-700">Reset</button>
            <button onClick={copy} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-500">Copy</button>
            <button onClick={download} className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold hover:bg-green-500">Download</button>
          </div>
        </header>

        {/* Framework selector */}
        <section>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {frameworks.map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedId(f.id)}
                className={`group rounded-2xl border border-neutral-800 p-4 text-left transition ${selectedId === f.id ? "ring-2 ring-offset-2 ring-offset-neutral-950 ring-blue-500" : "hover:bg-neutral-900"}`}
                aria-pressed={selectedId === f.id}
              >
                <div className={`mb-3 h-1.5 w-12 rounded-full ${f.color}`}></div>
                <div className="font-semibold">{f.name}</div>
                <div className="mt-1 text-sm text-neutral-400">{f.tagline}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Editor */}
        <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-6">
            <div className="rounded-2xl border border-neutral-800 p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{fw.name} Fields</h2>
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${fw.color}`}>{fw.tagline}</span>
              </div>
              <div className="space-y-4">
                {fw.fields.map(field => (
                  <label key={field.key} className="block">
                    <span className="mb-1 block text-sm text-neutral-300">{field.label}</span>
                    <textarea
                      rows={field.key.length > 6 ? 3 : 2}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-sm outline-none focus:border-neutral-700"
                      placeholder={field.placeholder}
                      value={values[field.key] || ""}
                      onChange={(e) => setValues(v => ({ ...v, [field.key]: e.target.value }))}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800 p-5">
              <h3 className="mb-3 text-lg font-semibold">Extras (optional)</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Audience" value={extras.audience} onChange={(v)=>setExtras(e=>({...e, audience:v}))} placeholder="e.g., B2B SaaS founders" />
                <Input label="Tone / Voice" value={extras.tone} onChange={(v)=>setExtras(e=>({...e, tone:v}))} placeholder="e.g., direct, concise, optimistic" />
                <Input label="Target Length" value={extras.length} onChange={(v)=>setExtras(e=>({...e, length:v}))} placeholder="e.g., ~300 words, 5 bullets" />
                <Input label="Style / Formatting" value={extras.style} onChange={(v)=>setExtras(e=>({...e, style:v}))} placeholder="e.g., markdown table, numbered steps" />
                <div className="sm:col-span-2">
                  <Input label="Constraints" value={extras.constraints} onChange={(v)=>setExtras(e=>({...e, constraints:v}))} placeholder="e.g., avoid jargon; cite sources" />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800 p-5">
              <h3 className="mb-3 text-lg font-semibold">Save / Title (optional)</h3>
              <Input label="Title for download" value={customTitle} onChange={setCustomTitle} placeholder="e.g., VoCo Messaging – SOLVE draft" />
              <p className="mt-2 text-xs text-neutral-400">The title is used as the filename when you download the prompt as <code>.md</code>.</p>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-2xl border border-neutral-800 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Preview</h2>
              <div className="flex gap-2">
                <button onClick={copy} className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold hover:bg-blue-500">Copy</button>
                <button onClick={download} className="rounded-xl bg-green-600 px-3 py-2 text-xs font-semibold hover:bg-green-500">Download</button>
              </div>
            </div>
            <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-xl bg-neutral-900 p-4 text-sm leading-relaxed">
{output}
            </pre>
            <p className="mt-3 text-xs text-neutral-500">Tip: Keep each field crisp. If a field is empty, it’s omitted from your prompt.</p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-neutral-500">
          <p>Built from the 8 popular prompt frameworks · R‑T‑F · S‑O‑L‑V‑E · T‑A‑G · R‑A‑C‑E · D‑R‑E‑A‑M · P‑A‑C‑T · C‑A‑R‑E · R‑I‑S‑E.</p>
        </footer>
      </div>
    </div>
  );
}

// ---------- Small UI helpers ----------
function Input({ label, value, onChange, placeholder }: { label: string; value: string | undefined; onChange: (v: string)=>void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-neutral-300">{label}</span>
      <input
        className="w-full rounded-xl border border-neutral-800 bg-neutral-900 p-3 text-sm outline-none focus:border-neutral-700"
        value={value || ""}
        onChange={(e)=>onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
