import { NextResponse } from "next/server";
import path from "path";
import { requireDevMode } from "@/lib/admin/devGuard";
import {
  readJsonFile,
  writeJsonFile,
  getChapterDir,
  removeFile,
} from "@/lib/admin/fileOps";
import { updateChapterInIndex } from "@/lib/admin/indexSync";
import type { ChapterMetadata } from "@/types/webtoon";

type RouteParams = { params: Promise<{ id: string; panelId: string }> };

export async function DELETE(_request: Request, { params }: RouteParams) {
  const guard = requireDevMode();
  if (guard) return guard;

  try {
    const { id, panelId } = await params;
    const chapterId = Number(id);
    const panelIdNum = Number(panelId);
    const chapterDir = getChapterDir(chapterId);
    const metaPath = path.join(chapterDir, "metadata.json");
    const metadata = await readJsonFile<ChapterMetadata>(metaPath);

    const panel = metadata.panels.find((p) => p.id === panelIdNum);
    if (!panel) {
      return NextResponse.json(
        { success: false, error: "Panel not found" },
        { status: 404 }
      );
    }

    // Delete the file
    const panelPath = path.join(chapterDir, "panels", panel.filename);
    await removeFile(panelPath);

    // Remove from metadata
    metadata.panels = metadata.panels.filter((p) => p.id !== panelIdNum);
    metadata.totalPanels = metadata.panels.length;
    metadata.estimatedReadTime = Math.max(1, Math.ceil(metadata.totalPanels / 3));

    await writeJsonFile(metaPath, metadata);
    await updateChapterInIndex(chapterId, { panelCount: metadata.totalPanels });

    return NextResponse.json({ success: true, data: metadata });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
