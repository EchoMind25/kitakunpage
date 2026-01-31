import Dexie, { type Table } from "dexie";
import type { ReadingProgress } from "@/types";

export interface OfflineChapter {
  chapterId: number;
  downloadedAt: number;
  expiresAt: number;
}

export interface SettingsRecord {
  key: string;
  value: string;
}

export class KitaWebtoonDB extends Dexie {
  readingProgress!: Table<ReadingProgress, number>;
  offlineChapters!: Table<OfflineChapter, number>;
  settings!: Table<SettingsRecord, string>;

  constructor() {
    super("KitaWebtoonDB");
    this.version(1).stores({
      readingProgress: "chapterId, scrollPosition, timestamp, panelIndex",
      offlineChapters: "chapterId, downloadedAt, expiresAt",
      settings: "key",
    });
  }
}

export const db = new KitaWebtoonDB();
