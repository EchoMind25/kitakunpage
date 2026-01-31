import { NextResponse } from "next/server";

export function requireDevMode(): NextResponse | null {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      { success: false, error: "Admin panel is only available in development mode" },
      { status: 403 }
    );
  }
  return null;
}
