"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface ChapterEndCardProps {
  currentChapterId: number;
  nextChapterId: number | null;
  prevChapterId: number | null;
  chapterTitle: string;
}

export function ChapterEndCard({
  currentChapterId,
  nextChapterId,
  prevChapterId,
  chapterTitle,
}: ChapterEndCardProps) {
  return (
    <div className="py-20 px-6">
      <div className="max-w-sm mx-auto">
        {/* Completion badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-900/50 to-maroon-900/30 border border-teal-700/20 mb-4">
            <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-teal-400 font-medium uppercase tracking-wider mb-1">
            Chapter Complete
          </p>
          <h3 className="text-lg font-bold text-white">{chapterTitle}</h3>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          {nextChapterId && (
            <Link href={`/read/${nextChapterId}`} className="block">
              <Button variant="primary" size="lg" className="w-full group">
                Continue to Chapter {nextChapterId}
                <svg className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
            </Link>
          )}

          <div className="flex gap-3">
            {prevChapterId && (
              <Link href={`/read/${prevChapterId}`} className="flex-1">
                <Button variant="secondary" size="md" className="w-full">
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                  </svg>
                  Ch. {prevChapterId}
                </Button>
              </Link>
            )}
            <Link href="/chapters" className={prevChapterId ? "flex-1" : "w-full"}>
              <Button variant="ghost" size="md" className="w-full">
                All Chapters
              </Button>
            </Link>
          </div>
        </div>

        {/* Decorative bottom */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-white/10" />
          <div className="w-1 h-1 rounded-full bg-teal-600" />
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-white/10" />
        </div>
      </div>
    </div>
  );
}
