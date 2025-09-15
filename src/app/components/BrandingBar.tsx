"use client";

import Image from "next/image";

export default function BrandingBar() {
  return (
    <div className="w-full border-b border-neutral-800 bg-neutral-950/80 backdrop-blur sticky top-0 z-[60]">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* ✅ Actual logo instead of plain text */}
          <Image
            src="/OOTI-Logo.png"  // must match file name in /public
            alt="OOTI Logo"
            width={32}
            height={32}
            className="rounded-md"
          />
          <div>
            <div className="text-sm uppercase tracking-widest text-neutral-400">
              Agents Out of the Internet
            </div>
            <div className="font-semibold leading-5">OOTI Prompt Lab</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://outoftheinternet.com"
            className="rounded-xl border border-neutral-800 px-3 py-1.5 text-sm hover:bg-neutral-900"
            target="_blank"
          >
            Visit OOTI
          </a>
          <a
            href="https://outoftheinternet.com/workshop?utm_source=promptlab&utm_medium=cta"
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
