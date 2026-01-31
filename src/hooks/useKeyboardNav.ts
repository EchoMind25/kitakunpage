"use client";

import { useEffect } from "react";

interface UseKeyboardNavOptions {
  onNextPanel?: () => void;
  onPrevPanel?: () => void;
  onToggleHeader?: () => void;
  onCloseDrawer?: () => void;
  enabled?: boolean;
}

export function useKeyboardNav({
  onNextPanel,
  onPrevPanel,
  onToggleHeader,
  onCloseDrawer,
  enabled = true,
}: UseKeyboardNavOptions) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
        case " ":
          e.preventDefault();
          onNextPanel?.();
          break;
        case "ArrowUp":
          e.preventDefault();
          onPrevPanel?.();
          break;
        case "Home":
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: "smooth" });
          break;
        case "End":
          e.preventDefault();
          window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: "smooth",
          });
          break;
        case "Escape":
          onCloseDrawer?.();
          break;
        case "h":
          onToggleHeader?.();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled, onNextPanel, onPrevPanel, onToggleHeader, onCloseDrawer]);
}
