import type { WebtoonIndex, ChapterMetadata, VirtualPanel } from "@/types";

const BASE_PATH = "/webtoon";

export async function loadWebtoonIndex(): Promise<WebtoonIndex> {
  const res = await fetch(`${BASE_PATH}/index.json`);
  if (!res.ok) throw new Error("Failed to load webtoon index");
  return res.json();
}

export async function loadChapterMetadata(
  chapterId: number
): Promise<ChapterMetadata> {
  const paddedId = String(chapterId).padStart(3, "0");
  const res = await fetch(`${BASE_PATH}/chapters/${paddedId}/metadata.json`);
  if (!res.ok) throw new Error(`Failed to load chapter ${chapterId} metadata`);
  return res.json();
}

export function buildPanelSrc(chapterId: number, filename: string): string {
  const paddedId = String(chapterId).padStart(3, "0");
  return `${BASE_PATH}/chapters/${paddedId}/panels/${filename}`;
}

export function flattenChapterPanels(
  chapters: ChapterMetadata[]
): VirtualPanel[] {
  const panels: VirtualPanel[] = [];
  let globalIndex = 0;

  for (const chapter of chapters) {
    for (let i = 0; i < chapter.panels.length; i++) {
      const panel = chapter.panels[i];
      panels.push({
        ...panel,
        chapterId: chapter.chapterId,
        chapterTitle: chapter.title,
        isChapterStart: i === 0,
        globalIndex,
        src: buildPanelSrc(chapter.chapterId, panel.filename),
      });
      globalIndex++;
    }
  }

  return panels;
}

export async function loadMultipleChapters(
  chapterIds: number[]
): Promise<ChapterMetadata[]> {
  const results = await Promise.all(
    chapterIds.map((id) => loadChapterMetadata(id))
  );
  return results;
}
