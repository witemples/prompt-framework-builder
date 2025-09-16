"use client";

import BrandingBar from "./components/BrandingBar";
import Footer from "./components/Footer";
import AccessGate from "./components/AccessGate";
import PromptFrameworkBuilder from "./components/PromptFrameworkBuilder";
import WorkshopBanner from "./components/WorkshopBanner";

// Google Analytics
import Script from "next/script";
import "../styles/globals.css";

import type { AppProps } from "next/app";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-neutral-950 text-neutral-100">
      {/* Google tag (gtag.js) */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-GPV20B463X"
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-GPV20B463X');
          `,
        }}
      />

      <BrandingBar />
      <AccessGate
        ghlIframeUrl="https://app.tritiumillumination.com/widget/form/UqdWo37aLs3Xk6chgEr?utm_source=promptlab&utm_medium=form&utm_campaign=workshop"
        title="Unlock the OOTI Prompt Lab"
      >
        <div className="mx-auto max-w-7xl px-4 py-6">
          <PromptFrameworkBuilder />
          <WorkshopBanner /> {/* stays where it is */}
        </div>
      </AccessGate>
      <Footer />
    </div>
  );
}
