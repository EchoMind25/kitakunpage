import Link from "next/link";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingContinue } from "@/components/landing/LandingContinue";
import { LandingLatest } from "@/components/landing/LandingLatest";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <LandingHero />

      <div className="max-w-5xl mx-auto px-4 pb-20">
        {/* Continue Reading Section */}
        <LandingContinue />

        {/* Latest Chapter Section */}
        <LandingLatest />

        {/* Quick Actions */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/chapters"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-teal-800/30 hover:bg-teal-950/20 transition-all duration-300"
          >
            <svg className="w-5 h-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
            </svg>
            <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
              Browse All Chapters
            </span>
          </Link>

          <Link
            href="/about"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-maroon-800/30 hover:bg-maroon-950/20 transition-all duration-300"
          >
            <svg className="w-5 h-5 text-maroon-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
            </svg>
            <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">
              About the Webtoon
            </span>
          </Link>
        </div>
      </div>

      <LandingFooter />
    </main>
  );
}
