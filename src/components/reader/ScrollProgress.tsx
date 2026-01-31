"use client";

interface ScrollProgressProps {
  progress: number;
}

export function ScrollProgress({ progress }: ScrollProgressProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[3px] bg-black/30 backdrop-blur-sm">
      <div
        className="h-full transition-[width] duration-150 ease-out rounded-r-full"
        style={{
          width: `${Math.min(100, Math.max(0, progress))}%`,
          background: `linear-gradient(90deg, #0d9488 0%, #14b8a6 50%, #7f1d1d 100%)`,
        }}
      />
    </div>
  );
}
