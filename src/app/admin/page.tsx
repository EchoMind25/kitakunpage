"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/admin/ui/Card";
import { useAdminApi } from "@/hooks/useAdminApi";
import type { DashboardStats } from "@/types/admin";
import type { ChapterSummary } from "@/types/webtoon";

export default function AdminDashboard() {
  const { get } = useAdminApi();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chapters, setChapters] = useState<ChapterSummary[]>([]);

  useEffect(() => {
    get<ChapterSummary[]>("/api/admin/chapters").then((res) => {
      if (res.success && res.data) {
        setChapters(res.data);
        const totalPanels = res.data.reduce((sum, c) => sum + c.panelCount, 0);
        setStats({
          totalChapters: res.data.length,
          totalPanels,
          lastUpdated: res.data.length > 0
            ? res.data[res.data.length - 1].publishDate
            : "N/A",
          contentSizeBytes: 0,
        });
      }
    });
  }, [get]);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-sm text-white/40">
          Overview of your webtoon content
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Chapters",
            value: stats?.totalChapters ?? "...",
            color: "teal",
          },
          {
            label: "Panels",
            value: stats?.totalPanels ?? "...",
            color: "white",
          },
          {
            label: "Last Updated",
            value: stats?.lastUpdated ?? "...",
            color: "white",
          },
          {
            label: "Status",
            value: "Dev Mode",
            color: "teal",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <p className="text-xs text-white/30 mb-1">{stat.label}</p>
            <p
              className={`text-xl font-bold ${
                stat.color === "teal" ? "text-teal-400" : "text-white"
              }`}
            >
              {stat.value}
            </p>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/chapters/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition-colors"
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
          <Link
            href="/admin/site"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            Edit Settings
          </Link>
          <Link
            href="/admin/theme"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-sm font-medium transition-colors"
          >
            Edit Theme
          </Link>
        </div>
      </Card>

      {/* Recent Chapters */}
      <Card>
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
          Recent Chapters
        </h3>
        {chapters.length === 0 ? (
          <p className="text-sm text-white/30">No chapters yet.</p>
        ) : (
          <div className="space-y-2">
            {[...chapters].reverse().slice(0, 5).map((chapter) => (
              <Link
                key={chapter.id}
                href={`/admin/chapters/${chapter.id}`}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs font-mono text-white/40">
                    {chapter.id}
                  </span>
                  <div>
                    <p className="text-sm text-white/80 group-hover:text-white">
                      {chapter.title}
                    </p>
                    <p className="text-xs text-white/30">
                      {chapter.panelCount} panels · {chapter.publishDate}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-medium uppercase ${
                    chapter.status === "published"
                      ? "bg-teal-950/50 text-teal-400 border border-teal-900/30"
                      : "bg-amber-950/50 text-amber-400 border border-amber-900/30"
                  }`}
                >
                  {chapter.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
