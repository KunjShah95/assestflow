"use client";

import Link from "next/link";
import { useState } from "react";

export default function DevelopersPage() {
  const [selectedLang, setSelectedLang] = useState<"curl" | "node" | "python">("curl");

  const codeSnippets = {
    curl: `curl -X GET "https://api.assetflow.com/v1/assets" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`,
    node: `const { AssetFlow } = require('@assetflow/sdk');
const client = new AssetFlow({ apiKey: 'YOUR_API_KEY' });

async function getAssets() {
  const assets = await client.assets.list({ limit: 10 });
  console.log(assets);
}
getAssets();`,
    python: `import assetflow

client = assetflow.Client(api_key="YOUR_API_KEY")

assets = client.assets.list(limit=10)
print(assets)`
  };

  return (
    <div className="min-h-screen pt-24 pb-section-padding text-left">
      <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
        <div className="text-center mb-16 animate-reveal active">
          <span className="text-primary font-bold tracking-widest uppercase text-label-sm">Developer Platform</span>
          <h1 className="font-display-hero text-display-hero mt-4 mb-6">Built for Integration</h1>
          <p className="text-text-secondary text-subheading-hero max-w-2xl mx-auto">
            Flexible APIs, SDKs, and webhooks designed to stream resource state changes to your existing ERP and logging stacks.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start mb-16">
          <div className="bg-white p-8 rounded-[24px] border border-border shadow-sm">
            <h2 className="text-headline-card font-headline-card mb-4">Quickstart Integration</h2>
            <p className="text-text-secondary mb-6">
              Retrieve real-time asset coordinates, check-out statuses, and telemetry drift variables in just a few lines of code. Get an API key from your admin portal to start querying.
            </p>
            <div className="flex gap-4 mb-6 border-b border-divider pb-4">
              <button
                onClick={() => setSelectedLang("curl")}
                className={`pb-2 font-bold transition-all border-b-2 ${
                  selectedLang === "curl" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-primary"
                }`}
              >
                cURL
              </button>
              <button
                onClick={() => setSelectedLang("node")}
                className={`pb-2 font-bold transition-all border-b-2 ${
                  selectedLang === "node" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-primary"
                }`}
              >
                NodeJS
              </button>
              <button
                onClick={() => setSelectedLang("python")}
                className={`pb-2 font-bold transition-all border-b-2 ${
                  selectedLang === "python" ? "border-primary text-primary" : "border-transparent text-text-secondary hover:text-primary"
                }`}
              >
                Python
              </button>
            </div>

            <pre className="bg-dark-bg text-white p-6 rounded-xl overflow-x-auto font-mono text-sm leading-relaxed">
              <code>{codeSnippets[selectedLang]}</code>
            </pre>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-8 rounded-[20px] border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center mb-4 border border-border">
                <span className="material-symbols-outlined text-primary">api</span>
              </div>
              <h3 className="font-bold text-text-primary text-lg mb-2">Full API Reference</h3>
              <p className="text-text-secondary mb-4 text-sm">
                Explore our full REST API endpoints, schemas, queries, and error configurations inside our interactive playground.
              </p>
              <Link href="/developers/api" className="text-primary font-bold inline-flex items-center gap-1 hover:underline">
                Explore API Docs
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>

            <div className="bg-white p-8 rounded-[20px] border border-border shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-surface rounded-lg flex items-center justify-center mb-4 border border-border">
                <span className="material-symbols-outlined text-primary">sync_alt</span>
              </div>
              <h3 className="font-bold text-text-primary text-lg mb-2">Webhooks & Streaming</h3>
              <p className="text-text-secondary mb-4 text-sm">
                Configure real-time webhooks to trigger tasks when assets are checked in, flagged for maintenance, or moved between sites.
              </p>
              <Link href="/developers/webhooks" className="text-primary font-bold inline-flex items-center gap-1 hover:underline">
                Setup Webhooks
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
