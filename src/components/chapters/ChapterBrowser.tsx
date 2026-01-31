"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { WebtoonIndex } from "@/types";
import { loadWebtoonIndex } from "@/lib/webtoon/chapterLoader";
import { ChapterGrid } from "./ChapterGrid";
import { Spinner } from "@/components/ui/Spinner";

export function ChapterBrowser() {
  const [index, setIndex] = useState<WebtoonIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortNewest, setSortNewest] = useState(true);

  useEffect(() => {
    loadWebtoonIndex()
      .then(setIndex)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const chapters = index
    ? sortNewest
      ? [...index.webtoon.chapters].sort((a, b) => b.id - a.id)
      : [...index.webtoon.chapters].sort((a, b) => a.id - b.id)
    : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              aria-label="Home"
            >
              <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-lg font-bold text-white">Chapters</h1>
          </div>

          {/* Sort toggle */}
          <button
            onClick={() => setSortNewest(!sortNewest)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/50 hover:text-white/80 hover:bg-white/10 transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            {sortNewest ? "Newest" : "Oldest"}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <Spinner size="lg" />
          </div>
        ) : index ? (
          <>
            {/* Webtoon info */}
            <div className="mb-8 pb-8 border-b border-white/5">
              <h2 className="text-2xl font-bold text-white mb-2">
                {index.webtoon.title}
              </h2>
              <p className="text-sm text-white/40 mb-4">
                {index.webtoon.description}
              </p>
              <div className="flex items-center gap-4 text-xs text-white/30">
                <span>By {index.webtoon.author}</span>
                <span className="text-white/10">|</span>
                <span className="capitalize">{index.webtoon.status}</span>
                <span className="text-white/10">|</span>
                <span>{index.webtoon.totalChapters} chapters</span>
                <span className="text-white/10">|</span>
                <div className="flex gap-1.5">
                  {index.webtoon.genre.map((g) => (
                    <span
                      key={g}
                      className="px-2 py-0.5 rounded bg-teal-950/50 border border-teal-900/30 text-teal-400"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <ChapterGrid chapters={chapters} />
          </>
        ) : (
          <div className="text-center py-20 text-white/30">
            Failed to load chapters.
          </div>
        )}
      </div>
    </div>
  );
}
