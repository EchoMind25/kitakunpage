import { NextResponse } from "next/server";
import path from "path";
import { requireDevMode } from "@/lib/admin/devGuard";
import { readJsonFile, writeJsonFile, getWebtoonBasePath, fileExists } from "@/lib/admin/fileOps";
import type { SiteConfig } from "@/types/admin";

const getConfigPath = () => path.join(getWebtoonBasePath(), "site-config.json");

export async function GET() {
  const guard = requireDevMode();
  if (guard) return guard;

  try {
    const configPath = getConfigPath();
    if (!(await fileExists(configPath))) {
      return NextResponse.json({ success: true, data: null });
    }
    const config = await readJsonFile<SiteConfig>(configPath);
    return NextResponse.json({ success: true, data: config });
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
    const body = await request.json();
    await writeJsonFile(getConfigPath(), body as SiteConfig);
    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
