"use client";

export default function BrandingBar() {
  return (
    <div className="w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Replace with your SVG/logo image if you have one */}
          <div className="h-7 w-7 rounded-lg bg-emerald-500/20 grid place-items-center text-emerald-400 text-sm font-bold">
            ⌘
          </div>
          <div>
            <div className="text-sm uppercase tracking-widest text-neutral-400">Agents Out of the Internet</div>
            <div className="font-semibold leading-5">OOTI Prompt Lab</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://outoftheinternet.com" // ← update to your site
            className="rounded-xl border border-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-900"
            target="_blank"
          >
            Visit OOTI
          </a>
          <a
            href="https://your-workshop-link.com" // ← put Sept 20 signup URL
            className="rounded-xl bg-emerald-600 px-3 py-1.5 text-sm font-semibold hover:bg-emerald-500"
            target="_blank"
          >
            Sept 20 Workshop
          </a>
        </div>
      </div>
    </div>
  );
}
