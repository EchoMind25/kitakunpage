"use client";

import { useCallback } from "react";
import { useAdminStore } from "@/store/adminStore";

export function useAdminApi() {
  const { addToast, setIsSaving, setHasUnsavedChanges } = useAdminStore();

  const request = useCallback(
    async <T>(
      url: string,
      options?: RequestInit
    ): Promise<{ success: boolean; data?: T; error?: string }> => {
      try {
        const res = await fetch(url, {
          headers: {
            ...(options?.body instanceof FormData
              ? {}
              : { "Content-Type": "application/json" }),
            ...options?.headers,
          },
          ...options,
        });
        const json = await res.json();
        if (!json.success) {
          addToast(json.error || "Request failed", "error");
        }
        return json;
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Network error";
        addToast(msg, "error");
        return { success: false, error: msg };
      }
    },
    [addToast]
  );

  const get = useCallback(
    <T>(url: string) => request<T>(url),
    [request]
  );

  const put = useCallback(
    async <T>(url: string, data: unknown) => {
      setIsSaving(true);
      const result = await request<T>(url, {
        method: "PUT",
        body: JSON.stringify(data),
      });
      setIsSaving(false);
      if (result.success) {
        setHasUnsavedChanges(false);
        addToast("Saved successfully");
      }
      return result;
    },
    [request, setIsSaving, setHasUnsavedChanges, addToast]
  );

  const post = useCallback(
    async <T>(url: string, data: unknown) => {
      setIsSaving(true);
      const result = await request<T>(url, {
        method: "POST",
        body: JSON.stringify(data),
      });
      setIsSaving(false);
      if (result.success) addToast("Created successfully");
      return result;
    },
    [request, setIsSaving, addToast]
  );

  const del = useCallback(
    async <T>(url: string) => {
      setIsSaving(true);
      const result = await request<T>(url, { method: "DELETE" });
      setIsSaving(false);
      if (result.success) addToast("Deleted successfully");
      return result;
    },
    [request, setIsSaving, addToast]
  );

  const upload = useCallback(
    async <T>(url: string, formData: FormData) => {
      setIsSaving(true);
      const result = await request<T>(url, {
        method: "POST",
        body: formData,
      });
      setIsSaving(false);
      if (result.success) addToast("Uploaded successfully");
      return result;
    },
    [request, setIsSaving, addToast]
  );

  return { get, put, post, del, upload };
}
