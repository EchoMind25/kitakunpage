import fs from "fs/promises";
import path from "path";
import type { SiteConfig } from "@/types/admin";
import { defaultConfig } from "./siteConfig";

/** Server-side only: load from filesystem */
export async function loadSiteConfig(): Promise<SiteConfig> {
  try {
    const configPath = path.join(process.cwd(), "public", "webtoon", "site-config.json");
    const raw = await fs.readFile(configPath, "utf-8");
    const config = JSON.parse(raw) as Partial<SiteConfig>;
    return { ...defaultConfig, ...config };
  } catch {
    return defaultConfig;
  }
}
