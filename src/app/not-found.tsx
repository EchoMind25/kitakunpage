import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] px-6">
      <div className="text-center max-w-sm">
        {/* 404 display */}
        <div className="relative inline-block mb-8">
          <span className="text-[120px] font-black leading-none text-white/[0.03]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-900/50 to-maroon-900/30 border border-teal-800/20 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-teal-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                />
              </svg>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Page Not Found</h1>
        <p className="text-sm text-white/40 mb-8">
          This panel doesn&apos;t exist in any chapter. Let&apos;s get you back
          to the story.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/chapters"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-medium text-sm border border-white/10 transition-colors"
          >
            Browse Chapters
          </Link>
        </div>
      </div>
    </div>
  );
}
