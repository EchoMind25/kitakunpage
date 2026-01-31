import { create } from "zustand";

interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

interface AdminStore {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toasts: ToastItem[];
  addToast: (message: string, type?: ToastItem["type"]) => void;
  removeToast: (id: string) => void;
  isSaving: boolean;
  setIsSaving: (saving: boolean) => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (has: boolean) => void;
}

export const useAdminStore = create<AdminStore>((set) => ({
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toasts: [],
  addToast: (message, type = "success") => {
    const id = Date.now().toString();
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 4000);
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
  isSaving: false,
  setIsSaving: (saving) => set({ isSaving: saving }),
  hasUnsavedChanges: false,
  setHasUnsavedChanges: (has) => set({ hasUnsavedChanges: has }),
}));
