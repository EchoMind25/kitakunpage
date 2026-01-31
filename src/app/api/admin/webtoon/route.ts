import { NextResponse } from "next/server";
import path from "path";
import { requireDevMode } from "@/lib/admin/devGuard";
import { readJsonFile, writeJsonFile, getWebtoonBasePath } from "@/lib/admin/fileOps";
import type { WebtoonIndex } from "@/types/webtoon";

const getIndexPath = () => path.join(getWebtoonBasePath(), "index.json");

export async function GET() {
  const guard = requireDevMode();
  if (guard) return guard;

  try {
    const index = await readJsonFile<WebtoonIndex>(getIndexPath());
    return NextResponse.json({ success: true, data: index.webtoon });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const guard = requireDevMode();
  if (guard) return guard;

  try {
    const updates = await request.json();
    const indexPath = getIndexPath();
    const index = await readJsonFile<WebtoonIndex>(indexPath);

    index.webtoon = {
      ...index.webtoon,
      ...updates,
      chapters: index.webtoon.chapters, // Protect chapters from being overwritten here
    };
    index.lastBuildDate = new Date().toISOString();

    await writeJsonFile(indexPath, index);
    return NextResponse.json({ success: true, data: index.webtoon });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
