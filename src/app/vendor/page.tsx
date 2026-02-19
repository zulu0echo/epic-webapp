"use client";

import { useState } from "react";

const RECIPIENT = "epic@ethereum.org";

export default function VendorPage() {
  const [orgName, setOrgName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `EPIC Vendor / Ecosystem: ${orgName.trim() || "Inquiry"}`;
    const body = [
      description.trim(),
      "",
      "---",
      "Vendor / Ecosystem form",
      `Organization: ${orgName.trim()}`,
      `Contact: ${contactName.trim()}`,
      `Email: ${email.trim()}`,
      `Category: ${category.trim() || "—"}`,
    ].join("\n");
    const mailto = `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <div className="epic-section max-w-xl">
      <div className="epic-card p-6 sm:p-8">
        <h1 className="epic-heading-2">Vendor / Ecosystem</h1>
        <p className="mt-2 epic-body">
          Tooling, protocols, or ecosystem partners relevant to EPIC can get in touch. Submissions go to{" "}
          <a href={`mailto:${RECIPIENT}`} className="text-indigo-600 font-medium hover:underline">
            {RECIPIENT}
          </a>
          .
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="orgName" className="block text-sm font-medium text-slate-700 mb-1.5">
              Organization / product name
            </label>
            <input
              id="orgName"
              type="text"
              className="epic-input"
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="contactName" className="block text-sm font-medium text-slate-700 mb-1.5">
              Contact name
            </label>
            <input
              id="contactName"
              type="text"
              className="epic-input"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="epic-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-1.5">
              Category (e.g. identity, payments, attestation)
            </label>
            <input
              id="category"
              type="text"
              className="epic-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="identity, payments, attestation, ..."
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1.5">
              Description / how you fit with EPIC
            </label>
            <textarea
              id="description"
              rows={5}
              className="epic-input resize-y min-h-[120px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="epic-btn-primary mt-2">
            Open email to send
          </button>
        </form>
      </div>
    </div>
  );
}
