"use client";

import BrandingBar from "./components/BrandingBar";
import Footer from "./components/Footer";
import AccessGate from "./components/AccessGate";
import PromptFrameworkBuilder from "./components/PromptFrameworkBuilder";
import WorkshopBanner from "./components/WorkshopBanner";
import VibePanel from "./components/VibePanel";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100">
      <BrandingBar />
      <AccessGate
        ghlIframeUrl="https://app.tritiumillumination.com/widget/form/UqdWo37aLs3Xk6chgiEr?utm_source=promptlab&utm_medium=form&utm_campaign=workshop-sept20"
        title="Unlock the OOTI Prompt Lab"
      >
        <div className="mx-auto max-w-7xl px-4 py-6">
          <VibePanel /> {/* ✅ New vibe selector */}
          <PromptFrameworkBuilder />
          <WorkshopBanner /> {/* stays where it is */}
        </div>
      </AccessGate>
      <Footer />
    </div>
  );
}

