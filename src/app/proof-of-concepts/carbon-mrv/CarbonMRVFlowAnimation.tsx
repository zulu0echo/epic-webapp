"use client";

import { useEffect, useState } from "react";
import {
  User,
  FileText,
  Hash,
  ShieldCheck,
  FileCheck,
  Database,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";

const STEPS = [
  {
    key: "project",
    label: "Project reports",
    sublabel: "A carbon project prepares an emissions summary (period, methodology, tCO₂e). Raw data stays private.",
    icon: User,
  },
  {
    key: "summary",
    label: "Summary → hash",
    sublabel: "The summary is hashed into a commitment (fingerprint). No full dataset is published to the registry.",
    icon: FileText,
  },
  {
    key: "commitment",
    label: "Commitment",
    sublabel: "The commitment can be shared with verifiers and registries. Anyone can later check that a summary matches.",
    icon: Hash,
  },
  {
    key: "verifier",
    label: "Verifier reviews",
    sublabel: "An accredited verifier reviews the full summary offchain and decides: verified or rejected.",
    icon: ShieldCheck,
  },
  {
    key: "attestation",
    label: "Signed attestation",
    sublabel: "The verifier signs an attestation bound to the commitment. No central authority needed to verify.",
    icon: FileCheck,
  },
  {
    key: "registry",
    label: "Registry",
    sublabel: "Attestations are stored in an append-only registry. Programs and buyers can list and verify them.",
    icon: Database,
  },
];

const DURATION_MS = 5000;
const TOTAL_MS = STEPS.length * DURATION_MS;

export function CarbonMRVFlowAnimation() {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const start = Date.now();
    let rafId: number;

    const tick = () => {
      const elapsed = Date.now() - start;
      const totalElapsed = elapsed % TOTAL_MS;
      const newIndex = Math.min(
        Math.floor(totalElapsed / DURATION_MS),
        STEPS.length - 1
      );
      setStepIndex(newIndex);
      setProgress((totalElapsed / TOTAL_MS) * 100);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [paused]);

  const current = STEPS[stepIndex]!;

  return (
    <div className="rounded-xl border-2 border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
          <Sparkles className="h-5 w-5 text-emerald-600" aria-hidden />
          How this PoC serves a carbon MRV use case
        </h3>
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200/80"
          aria-label={paused ? "Play animation" : "Pause animation"}
        >
          {paused ? "Play" : "Pause"}
        </button>
      </div>

      <p className="mb-4 text-sm text-slate-600">
        From project report → commitment → verifier attestation → registry. Raw emissions data stays offchain; only the fingerprint and signed attestation are shared.
      </p>

      {/* Progress bar */}
      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-150 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step description */}
      <div className="mb-6 min-h-[3rem] rounded-lg bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200/80">
        <p className="font-medium text-slate-900">{current.sublabel}</p>
      </div>

      {/* Flow diagram: nodes + arrows */}
      <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === stepIndex;
          const isPast = i < stepIndex;
          return (
            <div key={s.key} className="flex items-center gap-1 sm:gap-2">
              <div
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-2.5 sm:px-3 sm:py-3 transition-all duration-300",
                  isActive
                    ? "border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200"
                    : isPast
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-slate-200 bg-white"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6 sm:h-7 sm:w-7 transition-colors",
                    isActive ? "text-emerald-700" : isPast ? "text-emerald-600" : "text-slate-400"
                  )}
                  aria-hidden
                />
                <span
                  className={cn(
                    "text-xs font-medium sm:text-sm",
                    isActive ? "text-emerald-800" : isPast ? "text-emerald-700" : "text-slate-500"
                  )}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <ChevronRight
                  className={cn(
                    "h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-colors",
                    isPast ? "text-emerald-500" : "text-slate-300"
                  )}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
        ~30s loop · Project → commitment → verifier → attestation → registry
      </p>
    </div>
  );
}
