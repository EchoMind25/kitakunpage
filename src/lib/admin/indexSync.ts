import path from "path";
import fs from "fs/promises";
import type { WebtoonIndex, ChapterMetadata, ChapterSummary } from "@/types/webtoon";
import {
  getWebtoonBasePath,
  getChapterDir,
  readJsonFile,
  writeJsonFile,
  padChapterId,
} from "./fileOps";

export async function rebuildIndex(): Promise<WebtoonIndex> {
  const basePath = getWebtoonBasePath();
  const indexPath = path.join(basePath, "index.json");
  const currentIndex = await readJsonFile<WebtoonIndex>(indexPath);

  const chaptersDir = path.join(basePath, "chapters");
  let chapterDirs: string[] = [];
  try {
    const entries = await fs.readdir(chaptersDir, { withFileTypes: true });
    chapterDirs = entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
  } catch {
    chapterDirs = [];
  }

  const chapters: ChapterSummary[] = [];
  for (const dir of chapterDirs) {
    const metaPath = path.join(chaptersDir, dir, "metadata.json");
    try {
      const meta = await readJsonFile<ChapterMetadata>(metaPath);
      const panelsDir = path.join(chaptersDir, dir, "panels");
      let panelCount = meta.totalPanels;
      try {
        const panelFiles = await fs.readdir(panelsDir);
        panelCount = panelFiles.filter((f) => !f.startsWith(".")).length;
      } catch {
        // use metadata count
      }

      chapters.push({
        id: meta.chapterId,
        title: meta.title,
        publishDate: meta.publishDate,
        panelCount,
        thumbnail: `/webtoon/thumbnails/chapter-${padChapterId(meta.chapterId)}.webp`,
        status: "published",
      });
    } catch {
      // Skip malformed chapter dirs
    }
  }

  chapters.sort((a, b) => a.id - b.id);

  const updatedIndex: WebtoonIndex = {
    ...currentIndex,
    webtoon: {
      ...currentIndex.webtoon,
      totalChapters: chapters.length,
      chapters,
      updatedDate: new Date().toISOString().split("T")[0],
    },
    lastBuildDate: new Date().toISOString(),
  };

  // Recalculate chapter prev/next links
  await recalculateChapterLinks(chapters);

  await writeJsonFile(indexPath, updatedIndex);
  return updatedIndex;
}

export async function updateChapterInIndex(
  chapterId: number,
  updates: Partial<ChapterSummary>
): Promise<void> {
  const indexPath = path.join(getWebtoonBasePath(), "index.json");
  const index = await readJsonFile<WebtoonIndex>(indexPath);

  const chapterIdx = index.webtoon.chapters.findIndex((c) => c.id === chapterId);
  if (chapterIdx === -1) {
    // Add new chapter
    index.webtoon.chapters.push({
      id: chapterId,
      title: updates.title || `Chapter ${chapterId}`,
      publishDate: updates.publishDate || new Date().toISOString().split("T")[0],
      panelCount: updates.panelCount || 0,
      thumbnail: `/webtoon/thumbnails/chapter-${padChapterId(chapterId)}.webp`,
      status: updates.status || "draft",
    });
  } else {
    index.webtoon.chapters[chapterIdx] = {
      ...index.webtoon.chapters[chapterIdx],
      ...updates,
    };
  }

  index.webtoon.chapters.sort((a, b) => a.id - b.id);
  index.webtoon.totalChapters = index.webtoon.chapters.length;
  index.webtoon.updatedDate = new Date().toISOString().split("T")[0];
  index.lastBuildDate = new Date().toISOString();

  await writeJsonFile(indexPath, index);
}

export async function removeChapterFromIndex(chapterId: number): Promise<void> {
  const indexPath = path.join(getWebtoonBasePath(), "index.json");
  const index = await readJsonFile<WebtoonIndex>(indexPath);

  index.webtoon.chapters = index.webtoon.chapters.filter((c) => c.id !== chapterId);
  index.webtoon.chapters.sort((a, b) => a.id - b.id);
  index.webtoon.totalChapters = index.webtoon.chapters.length;
  index.webtoon.updatedDate = new Date().toISOString().split("T")[0];
  index.lastBuildDate = new Date().toISOString();

  await writeJsonFile(indexPath, index);
  await recalculateChapterLinks(index.webtoon.chapters);
}

export async function recalculateChapterLinks(
  chapters: ChapterSummary[]
): Promise<void> {
  const sorted = [...chapters].sort((a, b) => a.id - b.id);

  for (let i = 0; i < sorted.length; i++) {
    const chapterDir = getChapterDir(sorted[i].id);
    const metaPath = path.join(chapterDir, "metadata.json");
    try {
      const meta = await readJsonFile<ChapterMetadata>(metaPath);
      meta.prevChapter = i > 0 ? sorted[i - 1].id : null;
      meta.nextChapter = i < sorted.length - 1 ? sorted[i + 1].id : null;
      await writeJsonFile(metaPath, meta);
    } catch {
      // Skip if metadata doesn't exist
    }
  }
}
