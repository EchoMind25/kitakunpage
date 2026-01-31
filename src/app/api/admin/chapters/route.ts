import { NextResponse } from "next/server";
import path from "path";
import { requireDevMode } from "@/lib/admin/devGuard";
import {
  readJsonFile,
  writeJsonFile,
  getWebtoonBasePath,
  getChapterDir,
  ensureDir,
} from "@/lib/admin/fileOps";
import { updateChapterInIndex, recalculateChapterLinks } from "@/lib/admin/indexSync";
import type { WebtoonIndex, ChapterMetadata } from "@/types/webtoon";

export async function GET() {
  const guard = requireDevMode();
  if (guard) return guard;

  try {
    const indexPath = path.join(getWebtoonBasePath(), "index.json");
    const index = await readJsonFile<WebtoonIndex>(indexPath);
    return NextResponse.json({ success: true, data: index.webtoon.chapters });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const guard = requireDevMode();
  if (guard) return guard;

  try {
    const body = await request.json();
    const { title, publishDate, status, notes } = body;

    // Determine next chapter ID
    const indexPath = path.join(getWebtoonBasePath(), "index.json");
    const index = await readJsonFile<WebtoonIndex>(indexPath);
    const existingIds = index.webtoon.chapters.map((c) => c.id);
    const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

    // Create chapter directory + panels subdirectory
    const chapterDir = getChapterDir(nextId);
    await ensureDir(path.join(chapterDir, "panels"));

    // Create metadata.json
    const metadata: ChapterMetadata = {
      chapterId: nextId,
      title: title || `Chapter ${nextId}`,
      publishDate: publishDate || new Date().toISOString().split("T")[0],
      panels: [],
      totalPanels: 0,
      estimatedReadTime: 0,
      prevChapter: null,
      nextChapter: null,
      author: index.webtoon.author,
      notes: notes || "",
    };
    await writeJsonFile(path.join(chapterDir, "metadata.json"), metadata);

    // Update index.json
    await updateChapterInIndex(nextId, {
      title: metadata.title,
      publishDate: metadata.publishDate,
      panelCount: 0,
      status: status || "draft",
    });

    // Recalculate prev/next links
    const updatedIndex = await readJsonFile<WebtoonIndex>(indexPath);
    await recalculateChapterLinks(updatedIndex.webtoon.chapters);

    return NextResponse.json({ success: true, data: { id: nextId, ...metadata } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
