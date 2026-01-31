"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { WebtoonIndex } from "@/types";
import { loadWebtoonIndex } from "@/lib/webtoon/chapterLoader";

export function LandingLatest() {
  const [index, setIndex] = useState<WebtoonIndex | null>(null);

  useEffect(() => {
    loadWebtoonIndex()
      .then(setIndex)
      .catch(() => {});
  }, []);

  if (!index) return null;

  const latestChapters = [...index.webtoon.chapters]
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);

  return (
    <section className="mt-12 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-bold text-white/40 uppercase tracking-widest">
          Latest Chapters
        </h2>
        <Link
          href="/chapters"
          className="text-xs text-teal-600 hover:text-teal-400 transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="space-y-3">
        {latestChapters.map((chapter, i) => (
          <Link
            key={chapter.id}
            href={`/read/${chapter.id}`}
            className="group flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-teal-800/20 hover:bg-white/[0.04] transition-all duration-300"
          >
            {/* Chapter number */}
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-teal-900/40 to-maroon-900/20 border border-white/5 flex items-center justify-center">
              <span className="text-sm font-bold text-white/60">
                {chapter.id}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white/80 truncate group-hover:text-white transition-colors">
                {chapter.title}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-white/25">
                  {chapter.panelCount} panels
                </span>
                <span className="text-white/10">|</span>
                <span className="text-xs text-white/25">
                  {new Date(chapter.publishDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            {/* Badge for latest */}
            {i === 0 && (
              <span className="flex-shrink-0 px-2.5 py-0.5 rounded-md bg-maroon-900/50 border border-maroon-700/20 text-[10px] font-bold text-maroon-300 uppercase tracking-wider">
                New
              </span>
            )}

            {/* Arrow */}
            <svg className="w-4 h-4 text-white/20 group-hover:text-teal-400 transition-all group-hover:translate-x-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </section>
  );
}
