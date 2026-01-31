import { create } from "zustand";
import type { ChapterMetadata, VirtualPanel } from "@/types";

interface ReaderState {
  currentChapterId: number;
  currentPanelIndex: number;
  isHeaderVisible: boolean;
  isDrawerOpen: boolean;
  scrollProgress: number;
  chapters: ChapterMetadata[];
  flatPanels: VirtualPanel[];
  isLoading: boolean;
  error: string | null;

  setCurrentChapter: (id: number) => void;
  setCurrentPanelIndex: (index: number) => void;
  setHeaderVisible: (visible: boolean) => void;
  setDrawerOpen: (open: boolean) => void;
  setScrollProgress: (progress: number) => void;
  setChapters: (chapters: ChapterMetadata[]) => void;
  setFlatPanels: (panels: VirtualPanel[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useReaderStore = create<ReaderState>((set) => ({
  currentChapterId: 1,
  currentPanelIndex: 0,
  isHeaderVisible: true,
  isDrawerOpen: false,
  scrollProgress: 0,
  chapters: [],
  flatPanels: [],
  isLoading: false,
  error: null,

  setCurrentChapter: (id) => set({ currentChapterId: id }),
  setCurrentPanelIndex: (index) => set({ currentPanelIndex: index }),
  setHeaderVisible: (visible) => set({ isHeaderVisible: visible }),
  setDrawerOpen: (open) => set({ isDrawerOpen: open }),
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
  setChapters: (chapters) => set({ chapters }),
  setFlatPanels: (panels) => set({ flatPanels: panels }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
