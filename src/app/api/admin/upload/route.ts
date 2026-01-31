import { NextResponse } from "next/server";
import { requireDevMode } from "@/lib/admin/devGuard";
import { saveUploadedFile, getWebtoonBasePath } from "@/lib/admin/fileOps";

export async function POST(request: Request) {
  const guard = requireDevMode();
  if (guard) return guard;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const type = formData.get("type") as string; // "cover", "logo", "favicon", "avatar"

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file uploaded" },
        { status: 400 }
      );
    }

    const basePath = getWebtoonBasePath();
    let destDir: string;
    let filename: string;
    let publicPath: string;

    const ext = file.name.split(".").pop() || "png";

    switch (type) {
      case "cover":
        destDir = basePath;
        filename = `cover.${ext}`;
        publicPath = `/webtoon/cover.${ext}`;
        break;
      case "logo":
        destDir = basePath;
        filename = `logo.${ext}`;
        publicPath = `/webtoon/logo.${ext}`;
        break;
      case "favicon":
        destDir = basePath;
        filename = `favicon.${ext}`;
        publicPath = `/webtoon/favicon.${ext}`;
        break;
      case "avatar":
        destDir = basePath;
        filename = `avatar.${ext}`;
        publicPath = `/webtoon/avatar.${ext}`;
        break;
      default:
        destDir = basePath;
        filename = `upload-${Date.now()}.${ext}`;
        publicPath = `/webtoon/${filename}`;
    }

    await saveUploadedFile(file, destDir, filename);
    return NextResponse.json({ success: true, data: { path: publicPath } });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
