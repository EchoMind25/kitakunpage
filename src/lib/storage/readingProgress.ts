import { db } from "./db";
import type { ReadingProgress } from "@/types";

export async function saveReadingProgress(
  chapterId: number,
  scrollPosition: number,
  panelIndex: number,
  totalPanels: number
): Promise<void> {
  try {
    await db.readingProgress.put({
      chapterId,
      scrollPosition,
      panelIndex,
      timestamp: Date.now(),
      completionPercent: totalPanels > 0 ? (panelIndex / totalPanels) * 100 : 0,
    });
  } catch {
    // Silently fail - reading progress is non-critical
  }
}

export async function getReadingProgress(
  chapterId: number
): Promise<ReadingProgress | undefined> {
  try {
    return await db.readingProgress.get(chapterId);
  } catch {
    return undefined;
  }
}

export async function getLastReadChapter(): Promise<ReadingProgress | undefined> {
  try {
    const all = await db.readingProgress.orderBy("timestamp").reverse().first();
    return all;
  } catch {
    return undefined;
  }
}

export async function getAllProgress(): Promise<ReadingProgress[]> {
  try {
    return await db.readingProgress.toArray();
  } catch {
    return [];
  }
}
