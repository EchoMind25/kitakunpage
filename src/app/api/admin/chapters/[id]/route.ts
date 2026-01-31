import { NextResponse } from "next/server";
import path from "path";
import { requireDevMode } from "@/lib/admin/devGuard";
import {
  readJsonFile,
  writeJsonFile,
  getChapterDir,
  removeDir,
} from "@/lib/admin/fileOps";
import { updateChapterInIndex, removeChapterFromIndex } from "@/lib/admin/indexSync";
import type { ChapterMetadata } from "@/types/webtoon";

type RouteParams = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const guard = requireDevMode();
  if (guard) return guard;

  try {
    const { id } = await params;
    const chapterDir = getChapterDir(Number(id));
    const metadata = await readJsonFile<ChapterMetadata>(
      path.join(chapterDir, "metadata.json")
    );
    return NextResponse.json({ success: true, data: metadata });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 404 }
    );
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  const guard = requireDevMode();
  if (guard) return guard;

  try {
    const { id } = await params;
    const chapterId = Number(id);
    const updates = await request.json();
    const chapterDir = getChapterDir(chapterId);
    const metaPath = path.join(chapterDir, "metadata.json");
    const metadata = await readJsonFile<ChapterMetadata>(metaPath);

    const updatedMeta: ChapterMetadata = {
      ...metadata,
      ...updates,
      chapterId, // Prevent ID from being changed
      panels: metadata.panels, // Protect panels from being overwritten
    };
    await writeJsonFile(metaPath, updatedMeta);

    // Sync index
    await updateChapterInIndex(chapterId, {
      title: updatedMeta.title,
      publishDate: updatedMeta.publishDate,
      panelCount: updatedMeta.totalPanels,
      status: updates.status,
    });

    return NextResponse.json({ success: true, data: updatedMeta });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const guard = requireDevMode();
  if (guard) return guard;

  try {
    const { id } = await params;
    const chapterId = Number(id);
    const chapterDir = getChapterDir(chapterId);

    // Remove directory
    await removeDir(chapterDir);

    // Remove from index and recalculate links
    await removeChapterFromIndex(chapterId);

    return NextResponse.json({ success: true, data: { deleted: chapterId } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
