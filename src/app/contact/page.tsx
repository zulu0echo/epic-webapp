"use client";

import { useState } from "react";

const RECIPIENT = "epic@ethereum.org";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body = [
      message.trim(),
      "",
      "---",
      `From: ${name.trim()}`,
      `Email: ${email.trim()}`,
    ].join("\n");
    const mailto = `mailto:${RECIPIENT}?subject=${encodeURIComponent(subject.trim() || "EPIC Map contact")}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <div className="epic-section max-w-xl">
      <div className="epic-card p-6 sm:p-8">
        <h1 className="epic-heading-2">Contact</h1>
        <p className="mt-2 epic-body">
          Get in touch with the EPIC team. This form opens your email client and sends to{" "}
          <a href={`mailto:${RECIPIENT}`} className="text-epic-navy font-medium hover:underline">
            {RECIPIENT}
          </a>
          .
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1.5">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="epic-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1.5">
              Subject
            </label>
            <input
              id="subject"
              type="text"
              className="epic-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="EPIC contact"
            />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1.5">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              className="epic-input resize-y min-h-[120px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
