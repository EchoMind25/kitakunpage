import { NextResponse } from "next/server";
import path from "path";
import { requireDevMode } from "@/lib/admin/devGuard";
import {
  readJsonFile,
  writeJsonFile,
  getChapterDir,
  saveUploadedFile,
} from "@/lib/admin/fileOps";
import { updateChapterInIndex } from "@/lib/admin/indexSync";
import type { ChapterMetadata, Panel } from "@/types/webtoon";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  const guard = requireDevMode();
  if (guard) return guard;

  try {
    const { id } = await params;
    const chapterId = Number(id);
    const chapterDir = getChapterDir(chapterId);
    const metaPath = path.join(chapterDir, "metadata.json");
    const metadata = await readJsonFile<ChapterMetadata>(metaPath);

    const formData = await request.formData();
    const files = formData.getAll("panels") as File[];

    if (files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No files uploaded" },
        { status: 400 }
      );
    }

    const panelsDir = path.join(chapterDir, "panels");
    const existingMaxId = metadata.panels.length > 0
      ? Math.max(...metadata.panels.map((p) => p.id))
      : 0;

    const newPanels: Panel[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const panelId = existingMaxId + i + 1;
      const ext = file.name.split(".").pop() || "png";
      const filename = `${String(panelId).padStart(3, "0")}.${ext}`;

      await saveUploadedFile(file, panelsDir, filename);

      newPanels.push({
        id: panelId,
        filename,
        width: 800,
        height: 1200,
        fileSize: file.size,
        blurHash: "L6Pj0^jE.AyE_3t7t7R**0o#DgR4",
      });
    }

    metadata.panels = [...metadata.panels, ...newPanels];
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

export async function PUT(request: Request, { params }: RouteParams) {
  const guard = requireDevMode();
  if (guard) return guard;

  try {
    const { id } = await params;
    const chapterId = Number(id);
    const chapterDir = getChapterDir(chapterId);
    const metaPath = path.join(chapterDir, "metadata.json");
    const metadata = await readJsonFile<ChapterMetadata>(metaPath);

    const { panelOrder } = await request.json();
    if (!Array.isArray(panelOrder)) {
      return NextResponse.json(
        { success: false, error: "panelOrder must be an array of panel IDs" },
        { status: 400 }
      );
    }

    // Reorder panels according to provided ID order
    const panelMap = new Map(metadata.panels.map((p) => [p.id, p]));
    const reordered: Panel[] = [];
    for (const panelId of panelOrder) {
      const panel = panelMap.get(panelId);
      if (panel) reordered.push(panel);
    }

    metadata.panels = reordered;
    await writeJsonFile(metaPath, metadata);

    return NextResponse.json({ success: true, data: metadata });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
