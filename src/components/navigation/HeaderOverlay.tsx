"use client";

import Link from "next/link";

interface HeaderOverlayProps {
  visible: boolean;
  chapterTitle: string;
  onMenuClick: () => void;
}

export function HeaderOverlay({
  visible,
  chapterTitle,
  onMenuClick,
}: HeaderOverlayProps) {
  return (
    <header
      className={`
        fixed top-0 left-0 right-0 z-40
        transition-all duration-300 ease-out
        ${visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
      `}
    >
      {/* Gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/90 to-transparent pointer-events-none" />

      <div className="relative flex items-center justify-between px-4 py-3 pt-[calc(env(safe-area-inset-top)+12px)]">
        {/* Menu button */}
        <button
          onClick={onMenuClick}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          aria-label="Open chapter list"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        {/* Chapter title */}
        <div className="flex-1 mx-4 text-center">
          <p className="text-sm font-medium text-white truncate">
            {chapterTitle}
          </p>
        </div>

        {/* Home link */}
        <Link
          href="/"
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          aria-label="Home"
        >
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        </Link>
      </div>
    </header>
  );
}
