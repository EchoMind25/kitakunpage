"use client";

import { usePathname } from "next/navigation";
import { useAdminStore } from "@/store/adminStore";

const breadcrumbMap: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/site": "Site Settings",
  "/admin/webtoon": "Webtoon Info",
  "/admin/chapters": "Chapters",
  "/admin/chapters/new": "New Chapter",
  "/admin/pages": "Pages",
  "/admin/pages/landing": "Landing Page",
  "/admin/pages/about": "About Page",
  "/admin/pages/footer": "Footer",
  "/admin/theme": "Theme",
};

export function AdminHeader() {
  const pathname = usePathname();
  const { setSidebarOpen, isSaving, hasUnsavedChanges } = useAdminStore();

  const segments = pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((_, i) => {
    const path = "/" + segments.slice(0, i + 1).join("/");
    return {
      label: breadcrumbMap[path] || segments[i],
      path,
    };
  });

  return (
    <header className="sticky top-0 z-30 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <svg
              className="w-4 h-4 text-white/60"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.path} className="flex items-center gap-2">
                {i > 0 && <span className="text-white/20">/</span>}
                <span
                  className={
                    i === breadcrumbs.length - 1
                      ? "text-white font-medium"
                      : "text-white/40"
                  }
                >
                  {crumb.label}
                </span>
              </span>
            ))}
          </nav>
        </div>

        {/* Save status */}
        <div className="flex items-center gap-3">
          {isSaving && (
            <span className="flex items-center gap-2 text-xs text-white/40">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Saving...
            </span>
          )}
          {hasUnsavedChanges && !isSaving && (
            <span className="flex items-center gap-2 text-xs text-amber-400/60">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              Unsaved changes
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
