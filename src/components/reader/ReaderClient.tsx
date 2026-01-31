"use client";

import { useEffect, useState } from "react";
import type { ChapterMetadata, VirtualPanel, WebtoonIndex } from "@/types";
import {
  loadChapterMetadata,
  loadWebtoonIndex,
  flattenChapterPanels,
} from "@/lib/webtoon/chapterLoader";
import { VirtualPanelList } from "./VirtualPanelList";
import { Spinner } from "@/components/ui/Spinner";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

interface ReaderClientProps {
  initialChapterId: number;
}

export function ReaderClient({ initialChapterId }: ReaderClientProps) {
  const [chapterMeta, setChapterMeta] = useState<ChapterMetadata | null>(null);
  const [panels, setPanels] = useState<VirtualPanel[]>([]);
  const [index, setIndex] = useState<WebtoonIndex | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      setLoading(true);
      setError(null);

      try {
        const [meta, webtoonIndex] = await Promise.all([
          loadChapterMetadata(initialChapterId),
          loadWebtoonIndex(),
        ]);

        if (cancelled) return;

        setChapterMeta(meta);
        setIndex(webtoonIndex);
        setPanels(flattenChapterPanels([meta]));
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load chapter"
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => {
      cancelled = true;
    };
  }, [initialChapterId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-sm text-white/30">Loading chapter...</p>
        </div>
      </div>
    );
  }

  if (error || !chapterMeta || !index) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
        <div className="text-center px-6">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-maroon-900/30 border border-maroon-800/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-maroon-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Chapter Not Found
          </h2>
          <p className="text-white/40 mb-6">
            {error || `Chapter ${initialChapterId} could not be loaded.`}
          </p>
          <a
            href="/chapters"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition-colors"
          >
            Browse Chapters
          </a>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <VirtualPanelList
        panels={panels}
        chapterMeta={chapterMeta}
        allChapters={index.webtoon.chapters}
      />
    </ErrorBoundary>
  );
}
