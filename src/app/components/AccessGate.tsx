"use client";

import { useEffect, useMemo, useState } from "react";

type Props = {
  children: React.ReactNode;
  // Choose ONE of these two ways to embed your GHL form:
  ghlFormId?: string;         // Example: "abcd1234-ef56-7890-aaaa-bbbbccccdddd"
  ghlIframeUrl?: string;      // Example: "https://api.leadconnectorhq.com/widget/form/abcd1234-..."
  title?: string;
};

export default function AccessGate({ children, ghlFormId, ghlIframeUrl, title = "Unlock the OOTI Prompt Lab" }: Props) {
  const [granted, setGranted] = useState(false);

  // Allow bypass via ?access=1 for testing/sharing
  const bypass = useMemo(() => {
    if (typeof window === "undefined") return false;
    const params = new URLSearchParams(window.location.search);
    return params.get("access") === "1";
  }, []);

  useEffect(() => {
    if (bypass) { setGranted(true); return; }
    const saved = typeof window !== "undefined" ? localStorage.getItem("ooti.accessGranted") : null;
    if (saved === "true") setGranted(true);
  }, [bypass]);

  function handleContinue() {
    localStorage.setItem("ooti.accessGranted", "true");
    setGranted(true);
  }

  if (granted) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred background behind the gate */}
      <div className="pointer-events-none blur-sm">{children}</div>

      {/* Gate overlay */}
      <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-950/90 p-4">
        <div className="w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <p className="text-sm text-neutral-400 mb-4">
            Enter your email to get workshop resources and updates. After submitting, click Continue.
          </p>

          {/* --- Option A: IFRAME embed (simple & reliable) --- */}
          {ghlIframeUrl ? (
            <div className="rounded-xl overflow-hidden border border-neutral-800 mb-4">
              <iframe
                src={ghlIframeUrl}
                style={{ width: "100%", height: 520, border: "0" }}
                title="GHL Form"
              />
            </div>
          ) : null}

          {/* --- Option B: Script embed (uncomment if you prefer script) ---
          <GhlScriptEmbed formId={ghlFormId} />
          */}

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs text-neutral-500">
              Having trouble? You can also continue and we’ll follow up by email.
            </div>
            <button
              onClick={handleContinue}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold hover:bg-emerald-500"
            >
              Continue to Tool
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* If you want to use GHL’s script embed instead of an iframe, you can
   uncomment and use this helper. Make sure you pass `ghlFormId` prop.
*/
// function GhlScriptEmbed({ formId }: { formId?: string }) {
//   useEffect(() => {
//     if (!formId) return;
//     const script = document.createElement("script");
//     script.src = "https://link.msgsndr.com/js/form_embed.js";
//     script.async = true;
//     document.body.appendChild(script);
//     return () => { document.body.removeChild(script); };
//   }, [formId]);

//   if (!formId) return null;
//   return (
//     <div className="rounded-xl overflow-hidden border border-neutral-800 mb-4">
//       <div data-form-id={formId} />
//     </div>
//   );
// }

