"use client";

import { useEffect, useRef, useCallback } from "react";
import {
  saveReadingProgress,
  getReadingProgress,
} from "@/lib/storage/readingProgress";

interface UseReadingProgressOptions {
  chapterId: number;
  totalPanels: number;
  getCurrentPanelIndex: () => number;
  onRestore?: (scrollPosition: number) => void;
}

export function useReadingProgress({
  chapterId,
  totalPanels,
  getCurrentPanelIndex,
  onRestore,
}: UseReadingProgressOptions) {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasRestoredRef = useRef(false);

  const save = useCallback(() => {
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = setTimeout(() => {
      const panelIndex = getCurrentPanelIndex();
      const scrollPos = window.scrollY;
      saveReadingProgress(chapterId, scrollPos, panelIndex, totalPanels);
    }, 2000);
  }, [chapterId, totalPanels, getCurrentPanelIndex]);

  // Auto-save on scroll
  useEffect(() => {
    const handleScroll = () => save();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [save]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      const panelIndex = getCurrentPanelIndex();
      saveReadingProgress(chapterId, window.scrollY, panelIndex, totalPanels);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [chapterId, totalPanels, getCurrentPanelIndex]);

  // Restore position on mount
  useEffect(() => {
    if (hasRestoredRef.current) return;
    hasRestoredRef.current = true;

    getReadingProgress(chapterId).then((progress) => {
      if (progress && onRestore) {
        onRestore(progress.scrollPosition);
      }
    });
  }, [chapterId, onRestore]);
}
