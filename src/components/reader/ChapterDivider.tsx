"use client";

interface ChapterDividerProps {
  chapterNum: number;
  title: string;
}

export function ChapterDivider({ chapterNum, title }: ChapterDividerProps) {
  return (
    <div className="relative py-16 px-6">
      {/* Decorative lines */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-transparent to-teal-600/40" />

      <div className="max-w-md mx-auto text-center">
        {/* Chapter badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-950/50 border border-teal-800/30 mb-4">
          <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          <span className="text-xs font-medium text-teal-300 uppercase tracking-widest">
            Chapter {chapterNum}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-white mb-2">{title}</h2>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-maroon-700/50" />
          <div className="w-2 h-2 rotate-45 border border-teal-600/50 bg-teal-900/30" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-maroon-700/50" />
        </div>
      </div>

      <div className="absolute left-1/2 bottom-0 -translate-x-1/2 w-px h-8 bg-gradient-to-t from-transparent to-teal-600/40" />
    </div>
  );
}
