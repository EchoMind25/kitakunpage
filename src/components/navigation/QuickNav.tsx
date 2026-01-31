"use client";

interface QuickNavProps {
  onScrollTop: () => void;
  onScrollBottom: () => void;
  showTop: boolean;
}

export function QuickNav({ onScrollTop, onScrollBottom, showTop }: QuickNavProps) {
  return (
    <div className="fixed bottom-6 right-4 z-30 flex flex-col gap-2">
      {/* Scroll to top */}
      <button
        onClick={onScrollTop}
        className={`
          w-10 h-10 rounded-xl
          bg-[#0f0f0f]/80 backdrop-blur-md border border-white/10
          flex items-center justify-center
          hover:bg-teal-950/80 hover:border-teal-800/30
          transition-all duration-200
          ${showTop ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
        `}
        aria-label="Scroll to top"
      >
        <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      </button>

      {/* Scroll to bottom */}
      <button
        onClick={onScrollBottom}
        className="
          w-10 h-10 rounded-xl
          bg-[#0f0f0f]/80 backdrop-blur-md border border-white/10
          flex items-center justify-center
          hover:bg-teal-950/80 hover:border-teal-800/30
          transition-all duration-200
        "
        aria-label="Scroll to bottom"
      >
        <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
    </div>
  );
}
