
"use client";

export default function WorkshopBanner() {
  return (
    <div className="mt-8 rounded-2xl border border-emerald-700/50 bg-emerald-900/20 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-wider text-emerald-300/80">
            Agents Out of the Internet
          </p>
          <h3 className="mt-1 text-lg font-semibold text-emerald-100">
            Ready to go deeper? Join the Sept 20 Workshop.
          </h3>
          <p className="mt-1 text-sm text-emerald-200/80">
            We’ll build, test, and refine prompts live—bring what you make here.
          </p>
        </div>

        <div className="shrink-0">
          <a
            href="https://outoftheinternet.com/workshop?utm_source=promptlab&utm_medium=cta&utm_campaign=workshop-sept20"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            Reserve Your Spot →
          </a>
        </div>
      </div>
    </div>
  );
}
