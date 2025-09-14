"use client";

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 py-6 text-xs text-neutral-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-neutral-300">
            Agents Out of the Internet
          </span>{" "}
          – a project of{" "}
          <span className="font-medium text-neutral-300">
            Tritium Illumination, LLC
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            className="underline hover:text-neutral-200"
            href="https://outoftheinternet.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit OOTI
          </a>
          <a
            className="underline hover:text-neutral-200"
            href="https://your-privacy-link.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy
          </a>
          <a
            className="underline hover:text-neutral-200"
            href="https://your-terms-link.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
