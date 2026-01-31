import { NextResponse } from "next/server";
import path from "path";
import { requireDevMode } from "@/lib/admin/devGuard";
import { readJsonFile, writeJsonFile, getWebtoonBasePath, fileExists } from "@/lib/admin/fileOps";
import type { SiteConfig } from "@/types/admin";

const getConfigPath = () => path.join(getWebtoonBasePath(), "site-config.json");

type PageKey = "landing" | "about" | "footer" | "navigation";

type RouteParams = { params: Promise<{ page: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const guard = requireDevMode();
  if (guard) return guard;

  try {
    const { page } = await params;
    const configPath = getConfigPath();
    if (!(await fileExists(configPath))) {
      return NextResponse.json({ success: true, data: null });
    }
    const config = await readJsonFile<SiteConfig>(configPath);
    const key = page as PageKey;
    if (!(key in config)) {
      return NextResponse.json(
        { success: false, error: `Unknown page: ${page}` },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: config[key] });
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
    const { page } = await params;
    const body = await request.json();
    const configPath = getConfigPath();
    const config = await readJsonFile<SiteConfig>(configPath);
    const key = page as PageKey;

    if (!(key in config)) {
      return NextResponse.json(
        { success: false, error: `Unknown page: ${page}` },
        { status: 404 }
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (config as any)[key] = body;
    await writeJsonFile(configPath, config);

    return NextResponse.json({ success: true, data: body });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
