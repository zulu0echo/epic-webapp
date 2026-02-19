"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Login failed");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="epic-section max-w-sm mx-auto">
      <div className="epic-card p-6 sm:p-8">
        <h1 className="epic-heading-2 text-xl sm:text-2xl">Admin login</h1>
        <p className="mt-2 epic-body text-sm">
          System admins only. Access to Rolodex and CRM requires login.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="epic-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          <button type="submit" className="epic-btn-primary w-full">
            Log in
          </button>
        </form>
        <p className="mt-4 text-xs text-slate-500">
          Set <code className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">EPIC_ADMIN_SECRET</code> in .env for production.
        </p>
      </div>
    </div>
  );
}
