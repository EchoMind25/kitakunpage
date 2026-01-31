import type { Metadata } from "next";
import { ReaderClient } from "@/components/reader/ReaderClient";

interface ReadPageProps {
  params: Promise<{ chapter: string }>;
}

export async function generateMetadata({
  params,
}: ReadPageProps): Promise<Metadata> {
  const { chapter } = await params;

  return {
    title: `Chapter ${chapter}`,
    description: `Read Chapter ${chapter} of kitakun03's webtoon.`,
    openGraph: {
      title: `Chapter ${chapter} - kitakun03 Webtoon`,
      description: `Read Chapter ${chapter} online.`,
    },
  };
}

export default async function ReadPage({ params }: ReadPageProps) {
  const { chapter } = await params;
  const chapterId = parseInt(chapter, 10);

  return <ReaderClient initialChapterId={chapterId} />;
}
