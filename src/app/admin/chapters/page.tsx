"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/admin/ui/Card";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { useAdminApi } from "@/hooks/useAdminApi";
import type { ChapterSummary } from "@/types/webtoon";

export default function ChaptersPage() {
  const { get, del } = useAdminApi();
  const [chapters, setChapters] = useState<ChapterSummary[]>([]);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const loadChapters = () => {
    get<ChapterSummary[]>("/api/admin/chapters").then((res) => {
      if (res.success && res.data) setChapters(res.data);
    });
  };

  useEffect(() => {
    loadChapters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async () => {
    if (deleteId === null) return;
    await del(`/api/admin/chapters/${deleteId}`);
    setDeleteId(null);
    loadChapters();
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Chapters</h1>
          <p className="text-sm text-white/40">
            Manage your webtoon chapters
          </p>
        </div>
        <Link
          href="/admin/chapters/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
          New Chapter
        </Link>
      </div>

      <Card>
        {chapters.length === 0 ? (
          <p className="text-sm text-white/30 text-center py-8">
            No chapters yet. Create your first chapter to get started.
          </p>
        ) : (
          <div className="divide-y divide-white/5">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <span className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-mono text-white/40">
                    {chapter.id}
                  </span>
                  <div>
                    <Link
                      href={`/admin/chapters/${chapter.id}`}
                      className="text-sm font-medium text-white/80 hover:text-teal-400 transition-colors"
                    >
                      {chapter.title}
                    </Link>
                    <p className="text-xs text-white/30">
                      {chapter.panelCount} panels · {chapter.publishDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                      chapter.status === "published"
                        ? "bg-teal-950/50 text-teal-400 border border-teal-900/30"
                        : chapter.status === "draft"
                        ? "bg-amber-950/50 text-amber-400 border border-amber-900/30"
                        : "bg-blue-950/50 text-blue-400 border border-blue-900/30"
                    }`}
                  >
                    {chapter.status}
                  </span>
                  <Link
                    href={`/admin/chapters/${chapter.id}`}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                      />
                    </svg>
                  </Link>
                  <button
                    onClick={() => setDeleteId(chapter.id)}
                    className="w-8 h-8 rounded-lg bg-red-600/10 border border-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-600/20 transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Chapter"
        message={`Are you sure you want to delete chapter ${deleteId}? This will remove all panel files and cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
