"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLastReadChapter } from "@/lib/storage/readingProgress";
import type { ReadingProgress } from "@/types";

export function LandingContinue() {
  const [lastRead, setLastRead] = useState<ReadingProgress | null>(null);

  useEffect(() => {
    getLastReadChapter().then((progress) => {
      if (progress) setLastRead(progress);
    });
  }, []);

  if (!lastRead) return null;

  return (
    <section className="mt-12 animate-fade-in-up">
      <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
        Continue Reading
      </h2>

      <Link
        href={`/read/${lastRead.chapterId}`}
        className="group block p-5 rounded-2xl bg-gradient-to-r from-teal-950/30 to-transparent border border-teal-800/20 hover:border-teal-700/30 transition-all duration-300"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-teal-300">
              Chapter {lastRead.chapterId}
            </p>
            <div className="flex items-center gap-3 mt-2">
              {/* Progress bar */}
              <div className="w-32 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400"
                  style={{
                    width: `${Math.min(100, lastRead.completionPercent)}%`,
                  }}
                />
              </div>
              <span className="text-xs text-white/30">
                {Math.round(lastRead.completionPercent)}% complete
              </span>
            </div>
          </div>

          <div className="w-10 h-10 rounded-xl bg-teal-600/20 border border-teal-700/20 flex items-center justify-center group-hover:bg-teal-600/30 transition-colors">
            <svg className="w-5 h-5 text-teal-400 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </Link>
    </section>
  );
}
