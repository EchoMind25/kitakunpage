"use client";

import { useEffect, useState } from "react";
import type { ChapterSummary } from "@/types";
import { ChapterCard } from "./ChapterCard";
import { getAllProgress } from "@/lib/storage/readingProgress";
import type { ReadingProgress } from "@/types";

interface ChapterGridProps {
  chapters: ChapterSummary[];
}

export function ChapterGrid({ chapters }: ChapterGridProps) {
  const [progressMap, setProgressMap] = useState<Record<number, number>>({});

  useEffect(() => {
    getAllProgress().then((progressList: ReadingProgress[]) => {
      const map: Record<number, number> = {};
      progressList.forEach((p) => {
        map[p.chapterId] = p.completionPercent;
      });
      setProgressMap(map);
    });
  }, []);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {chapters.map((chapter) => (
        <ChapterCard
          key={chapter.id}
          chapter={chapter}
          progress={progressMap[chapter.id]}
        />
      ))}
    </div>
  );
}
