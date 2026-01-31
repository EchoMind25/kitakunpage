"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { ChapterSummary } from "@/types";

interface ChapterDrawerProps {
  open: boolean;
  onClose: () => void;
  chapters: ChapterSummary[];
  currentChapterId: number;
}

export function ChapterDrawer({
  open,
  onClose,
  chapters,
  currentChapterId,
}: ChapterDrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Focus trap and close on escape
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  // Scroll current chapter into view
  useEffect(() => {
    if (!open || !drawerRef.current) return;

    const currentEl = drawerRef.current.querySelector(`[data-chapter="${currentChapterId}"]`);
    if (currentEl) {
      currentEl.scrollIntoView({ block: "center", behavior: "smooth" });
    }
  }, [open, currentChapterId]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`
          fixed inset-0 z-40 bg-black/60 backdrop-blur-sm
          transition-opacity duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        className={`
          fixed top-0 left-0 bottom-0 z-50 w-[280px] max-w-[80vw]
          bg-[#0f0f0f] border-r border-white/5
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          flex flex-col
        `}
        role="dialog"
        aria-label="Chapter navigation"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/5">
          <h2 className="text-sm font-bold text-white uppercase tracking-widest">
            Chapters
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Close"
          >
            <svg className="w-4 h-4 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Accent line */}
        <div className="h-[2px] bg-gradient-to-r from-teal-600 via-maroon-700 to-transparent" />

        {/* Chapter list */}
        <div className="flex-1 overflow-y-auto py-2 overscroll-contain">
          {chapters.map((chapter) => {
            const isCurrent = chapter.id === currentChapterId;

            return (
              <Link
                key={chapter.id}
                href={`/read/${chapter.id}`}
                data-chapter={chapter.id}
                onClick={onClose}
                className={`
                  flex items-center gap-3 px-4 py-3 mx-2 rounded-lg
                  transition-all duration-150
                  ${
                    isCurrent
                      ? "bg-teal-950/50 border border-teal-800/30"
                      : "hover:bg-white/5 border border-transparent"
                  }
                `}
              >
                {/* Indicator */}
                <div
                  className={`
                    w-2 h-2 rounded-full flex-shrink-0
                    ${isCurrent ? "bg-teal-400 shadow-lg shadow-teal-400/50" : "bg-white/10"}
                  `}
                />

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-medium truncate ${
                      isCurrent ? "text-teal-300" : "text-white/70"
                    }`}
                  >
                    {chapter.title}
                  </p>
                  <p className="text-xs text-white/30 mt-0.5">
                    {chapter.panelCount} panels
                  </p>
                </div>

                {isCurrent && (
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex-shrink-0">
                    Now
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/5">
          <Link
            href="/chapters"
            onClick={onClose}
            className="block text-center text-xs text-white/40 hover:text-teal-400 transition-colors"
          >
            View All Chapters
          </Link>
        </div>
      </aside>
    </>
  );
}
