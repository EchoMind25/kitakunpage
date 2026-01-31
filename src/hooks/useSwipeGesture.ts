"use client";

import { useEffect, useRef } from "react";

interface UseSwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  threshold?: number;
  element?: HTMLElement | null;
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  threshold = 80,
  element,
}: UseSwipeGestureOptions) {
  const startXRef = useRef(0);
  const startYRef = useRef(0);

  useEffect(() => {
    const target = element || document;

    const handleTouchStart = (e: Event) => {
      const touch = (e as TouchEvent).touches[0];
      startXRef.current = touch.clientX;
      startYRef.current = touch.clientY;
    };

    const handleTouchEnd = (e: Event) => {
      const touch = (e as TouchEvent).changedTouches[0];
      const deltaX = touch.clientX - startXRef.current;
      const deltaY = Math.abs(touch.clientY - startYRef.current);

      // Only trigger if horizontal swipe is dominant
      if (Math.abs(deltaX) > threshold && Math.abs(deltaX) > deltaY) {
        if (deltaX > 0) {
          onSwipeRight?.();
        } else {
          onSwipeLeft?.();
        }
      }
    };

    target.addEventListener("touchstart", handleTouchStart, { passive: true });
    target.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      target.removeEventListener("touchstart", handleTouchStart);
      target.removeEventListener("touchend", handleTouchEnd);
    };
  }, [element, onSwipeLeft, onSwipeRight, threshold]);
}
