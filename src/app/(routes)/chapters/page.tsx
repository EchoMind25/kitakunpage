import type { Metadata } from "next";
import { ChapterBrowser } from "@/components/chapters/ChapterBrowser";

export const metadata: Metadata = {
  title: "Chapters",
  description: "Browse all chapters of kitakun03's webtoon.",
};

export default function ChaptersPage() {
  return <ChapterBrowser />;
}
