export interface Panel {
  id: number;
  filename: string;
  width: number;
  height: number;
  fileSize: number;
  blurHash: string;
}

export interface ChapterMetadata {
  chapterId: number;
  title: string;
  publishDate: string;
  panels: Panel[];
  totalPanels: number;
  estimatedReadTime: number;
  prevChapter: number | null;
  nextChapter: number | null;
  author: string;
  notes: string;
}

export interface ChapterSummary {
  id: number;
  title: string;
  publishDate: string;
  panelCount: number;
  thumbnail: string;
  status: "published" | "draft" | "scheduled";
}

export interface WebtoonIndex {
  webtoon: {
    title: string;
    author: string;
    description: string;
    genre: string[];
    status: "ongoing" | "completed" | "hiatus";
    publishedDate: string;
    updatedDate: string;
    totalChapters: number;
    coverImage: string;
    chapters: ChapterSummary[];
  };
  version: string;
  lastBuildDate: string;
}

export interface ReadingProgress {
  chapterId: number;
  scrollPosition: number;
  panelIndex: number;
  timestamp: number;
  completionPercent: number;
}

export interface VirtualPanel extends Panel {
  chapterId: number;
  chapterTitle: string;
  isChapterStart: boolean;
  globalIndex: number;
  src: string;
}
