"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { VirtualPanel, ChapterMetadata } from "@/types";
import { PanelImage } from "./PanelImage";
import { ChapterDivider } from "./ChapterDivider";
import { ChapterEndCard } from "./ChapterEndCard";
import { ScrollProgress } from "./ScrollProgress";
import { HeaderOverlay } from "@/components/navigation/HeaderOverlay";
import { ChapterDrawer } from "@/components/navigation/ChapterDrawer";
import { QuickNav } from "@/components/navigation/QuickNav";
import { useReaderStore } from "@/store/readerStore";
import { useReadingProgress } from "@/hooks/useReadingProgress";
import { useKeyboardNav } from "@/hooks/useKeyboardNav";
import { useSwipeGesture } from "@/hooks/useSwipeGesture";
import { preloadPanelRange } from "@/lib/webtoon/preloader";
import type { ChapterSummary } from "@/types";

interface VirtualPanelListProps {
  panels: VirtualPanel[];
  chapterMeta: ChapterMetadata;
  allChapters: ChapterSummary[];
}

export function VirtualPanelList({
  panels,
  chapterMeta,
  allChapters,
}: VirtualPanelListProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const {
    isHeaderVisible,
    isDrawerOpen,
    setHeaderVisible,
    setDrawerOpen,
    setCurrentPanelIndex,
  } = useReaderStore();

  const lastScrollY = useRef(0);

  // Total items = panels + 1 end card
  const totalItems = panels.length + 1;

  const virtualizer = useVirtualizer({
    count: totalItems,
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: (index) => {
      if (index >= panels.length) return 400; // end card
      const panel = panels[index];
      if (panel.isChapterStart) return panel.height + 160; // divider + panel
      return panel.height;
    },
    overscan: 5,
  });

  // Track scroll for header hide/show and progress
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let rafId: number;
    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const currentScrollY = container.scrollTop;
        const maxScroll = container.scrollHeight - container.clientHeight;
        const progress = maxScroll > 0 ? (currentScrollY / maxScroll) * 100 : 0;

        setScrollProgress(progress);

        if (currentScrollY < 100) {
          setHeaderVisible(true);
        } else if (currentScrollY > lastScrollY.current + 10) {
          setHeaderVisible(false);
        } else if (currentScrollY < lastScrollY.current - 10) {
          setHeaderVisible(true);
        }

        lastScrollY.current = currentScrollY;

        // Determine current panel index
        const items = virtualizer.getVirtualItems();
        if (items.length > 0) {
          const midItem = items[Math.floor(items.length / 2)];
          if (midItem.index < panels.length) {
            setCurrentPanelIndex(midItem.index);
          }
        }
      });
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, [virtualizer, panels.length, setHeaderVisible, setCurrentPanelIndex]);

  // Preload panels ahead
  useEffect(() => {
    const items = virtualizer.getVirtualItems();
    if (items.length > 0) {
      const lastVisible = items[items.length - 1].index;
      preloadPanelRange(panels, lastVisible + 1, 5);
    }
  }, [virtualizer.getVirtualItems, panels]);

  const getCurrentPanelIndex = useCallback(() => {
    const items = virtualizer.getVirtualItems();
    if (items.length > 0) {
      return items[Math.floor(items.length / 2)].index;
    }
    return 0;
  }, [virtualizer]);

  useReadingProgress({
    chapterId: chapterMeta.chapterId,
    totalPanels: chapterMeta.totalPanels,
    getCurrentPanelIndex,
    onRestore: (scrollPosition) => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = scrollPosition;
      }
    },
  });

  useKeyboardNav({
    onNextPanel: () => {
      scrollContainerRef.current?.scrollBy({ top: 400, behavior: "smooth" });
    },
    onPrevPanel: () => {
      scrollContainerRef.current?.scrollBy({ top: -400, behavior: "smooth" });
    },
    onToggleHeader: () => setHeaderVisible(!isHeaderVisible),
    onCloseDrawer: () => setDrawerOpen(false),
  });

  useSwipeGesture({
    onSwipeRight: () => setDrawerOpen(true),
    onSwipeLeft: () => setDrawerOpen(false),
    element: scrollContainerRef.current,
  });

  return (
    <div className="relative h-screen bg-[#0a0a0a]">
      <ScrollProgress progress={scrollProgress} />

      <HeaderOverlay
        visible={isHeaderVisible}
        chapterTitle={chapterMeta.title}
        onMenuClick={() => setDrawerOpen(true)}
      />

      <ChapterDrawer
        open={isDrawerOpen}
        onClose={() => setDrawerOpen(false)}
        chapters={allChapters}
        currentChapterId={chapterMeta.chapterId}
      />

      <div
        ref={scrollContainerRef}
        className="scroll-container h-full overflow-y-auto overscroll-contain"
      >
        <div
          className="relative w-full max-w-3xl mx-auto"
          style={{ height: `${virtualizer.getTotalSize()}px` }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const isEndCard = virtualRow.index >= panels.length;

            if (isEndCard) {
              return (
                <div
                  key="end-card"
                  className="absolute top-0 left-0 w-full"
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                  ref={virtualizer.measureElement}
                  data-index={virtualRow.index}
                >
                  <ChapterEndCard
                    currentChapterId={chapterMeta.chapterId}
                    nextChapterId={chapterMeta.nextChapter}
                    prevChapterId={chapterMeta.prevChapter}
                    chapterTitle={chapterMeta.title}
                  />
                </div>
              );
            }

            const panel = panels[virtualRow.index];

            return (
              <div
                key={`${panel.chapterId}-${panel.id}`}
                className="absolute top-0 left-0 w-full"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                ref={virtualizer.measureElement}
                data-index={virtualRow.index}
              >
                {panel.isChapterStart && (
                  <ChapterDivider
                    chapterNum={panel.chapterId}
                    title={panel.chapterTitle}
                  />
                )}
                <PanelImage panel={panel} />
              </div>
            );
          })}
        </div>
      </div>

      <QuickNav
        onScrollTop={() =>
          scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" })
        }
        onScrollBottom={() =>
          scrollContainerRef.current?.scrollTo({
            top: scrollContainerRef.current.scrollHeight,
            behavior: "smooth",
          })
        }
        showTop={lastScrollY.current > 500}
      />
    </div>
  );
}
