"use client";

import { useState, FormEvent } from "react";
import { CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen pt-24 pb-section-padding text-left">
      <div className="max-w-container-max mx-auto px-margin-desktop relative z-10">
        <div className="text-center mb-16 animate-reveal active">
          <span className="text-primary font-bold tracking-widest uppercase text-label-sm">Get in touch</span>
          <h1 className="font-display-hero text-display-hero mt-4 mb-6">Contact AssetFlow OS</h1>
          <p className="text-text-secondary text-subheading-hero max-w-2xl mx-auto">
            Discuss your enterprise resource tracking needs with our systems architecture team.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="bg-white p-8 md:p-10 rounded-[24px] border border-border shadow-sm">
            <h2 className="text-headline-card font-bold text-text-primary mb-6 border-b border-divider pb-4">Send Us a Message</h2>

            {submitted ? (
              <div className="bg-success/10 border border-success/20 text-success p-6 rounded-xl flex items-start gap-3">
                <CheckCircle size={20} className="shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-lg">Inquiry Received</h4>
                  <p className="text-sm mt-1">Our enterprise accounts team will review your message and contact you within 24 hours.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-label-md text-text-primary mb-1" htmlFor="name">Name</label>
                  <input
                    className="w-full bg-surface-container-lowest border border-border rounded text-body-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-label-md text-text-primary mb-1" htmlFor="email">Email</label>
                  <input
                    className="w-full bg-surface-container-lowest border border-border rounded text-body-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-label-md text-text-primary mb-1" htmlFor="company">Company</label>
                  <input
                    className="w-full bg-surface-container-lowest border border-border rounded text-body-md px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                    id="company"
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-label-md text-text-primary mb-1" htmlFor="message">Message</label>
                  <textarea
                    className="w-full bg-surface-container-lowest border border-border rounded text-body-md px-3 py-2.5 min-h-[120px] focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-shadow"
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-primary hover:bg-accent-hover text-on-primary font-bold py-3 px-4 rounded-full transition-colors focus:outline-none">
                  Submit Inquiry
                </button>
              </form>
            )}
          </div>

          <div className="space-y-6 text-left">
            <div className="bg-white p-8 rounded-[20px] border border-border shadow-sm">
              <h3 className="font-bold text-text-primary text-lg mb-2">Technical Support</h3>
              <p className="text-text-secondary text-sm mb-4">
                Are you an existing client experiencing issues? Raise support tickets directly from the Command Center or email support.
              </p>
              <p className="font-semibold text-primary">support@assetflow.com</p>
            </div>

            <div className="bg-white p-8 rounded-[20px] border border-border shadow-sm">
              <h3 className="font-bold text-text-primary text-lg mb-2">Headquarters</h3>
              <p className="text-text-secondary text-sm mb-4">
                AssetFlow Technologies Inc.<br />
                100 Pine Street, Suite 2400<br />
                San Francisco, CA 94111
              </p>
              <p className="font-semibold text-primary">sales@assetflow.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
