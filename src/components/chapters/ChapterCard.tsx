"use client";

import Link from "next/link";
import type { ChapterSummary } from "@/types";

interface ChapterCardProps {
  chapter: ChapterSummary;
  progress?: number;
}

export function ChapterCard({ chapter, progress }: ChapterCardProps) {
  const isRead = progress !== undefined && progress >= 95;
  const isReading = progress !== undefined && progress > 0 && progress < 95;

  return (
    <Link
      href={`/read/${chapter.id}`}
      className="group block rounded-2xl overflow-hidden bg-white/[0.03] border border-white/5 hover:border-teal-800/30 hover:bg-white/[0.05] transition-all duration-300"
    >
      {/* Thumbnail */}
      <div className="relative aspect-[2/3] bg-gradient-to-br from-teal-950/20 to-maroon-950/20 overflow-hidden">
        {chapter.thumbnail ? (
          <img
            src={chapter.thumbnail}
            alt={chapter.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-black text-white/5">
              {chapter.id}
            </span>
          </div>
        )}

        {/* Status badge */}
        {isRead && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-teal-600/90 backdrop-blur-sm">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              Read
            </span>
          </div>
        )}
        {isReading && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-maroon-700/90 backdrop-blur-sm">
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">
              {Math.round(progress)}%
            </span>
          </div>
        )}

        {/* Progress bar overlay */}
        {isReading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/40">
            <div
              className="h-full bg-teal-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-60" />
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-white truncate group-hover:text-teal-300 transition-colors">
          {chapter.title}
        </h3>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-white/30">
            {chapter.panelCount} panels
          </span>
          <span className="text-xs text-white/20">
            {new Date(chapter.publishDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
