"use client";

import Link from "next/link";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export function AboutContent() {
  const { config } = useSiteConfig();
  const author = config.author;

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      {/* Creator Section */}
      <section className="mb-16">
        <div className="flex items-start gap-6 mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center shadow-xl shadow-teal-900/30 border border-teal-500/20 flex-shrink-0">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              <span className="text-3xl font-black text-white">K</span>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{author.name}</h2>
            <p className="text-sm text-teal-400 mb-3">{author.role}</p>
            <p className="text-sm text-white/50 leading-relaxed">{author.bio}</p>
          </div>
        </div>
      </section>

      {/* Dynamic about sections from config */}
      {config.about.sections
        .filter((s) => s.visible)
        .map((section) => (
          <section key={section.id} className="mb-16">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">
              {section.title}
            </h3>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <p className="text-sm text-white/50 leading-relaxed">
                {section.content}
              </p>
            </div>
          </section>
        ))}

      {/* The Webtoon */}
      <section className="mb-16">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">
          About the Webtoon
        </h3>
        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-white/30 mb-1">Genre</p>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded text-xs bg-teal-950/50 border border-teal-900/30 text-teal-400">
                  Action
                </span>
                <span className="px-2 py-0.5 rounded text-xs bg-maroon-950/50 border border-maroon-900/30 text-maroon-400">
                  Fantasy
                </span>
              </div>
            </div>
            <div>
              <p className="text-xs text-white/30 mb-1">Status</p>
              <p className="text-sm text-white/70">Ongoing</p>
            </div>
            <div>
              <p className="text-xs text-white/30 mb-1">First Published</p>
              <p className="text-sm text-white/70">February 1, 2026</p>
            </div>
            <div>
              <p className="text-xs text-white/30 mb-1">Schedule</p>
              <p className="text-sm text-white/70">Weekly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Reader Features */}
      <section className="mb-16">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">
          Reader Features
        </h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-4.5L16.5 16.5m0 0L12 12m4.5 4.5V3" />
              ),
              title: "Infinite Vertical Scroll",
              desc: "Seamless reading flow, panel by panel",
              color: "teal",
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
              ),
              title: "Lightning Fast",
              desc: "60fps scroll, optimized for mobile",
              color: "teal",
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
              ),
              title: "Smart Progress",
              desc: "Auto-saves your reading position",
              color: "maroon",
            },
            {
              icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
              ),
              title: "Mobile First",
              desc: "Designed for phones, works everywhere",
              color: "maroon",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className={`p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-${feature.color}-800/20 transition-colors`}
            >
              <svg
                className={`w-6 h-6 text-${feature.color}-500 mb-3`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {feature.icon}
              </svg>
              <h4 className="text-sm font-semibold text-white mb-1">
                {feature.title}
              </h4>
              <p className="text-xs text-white/40">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Keyboard shortcuts */}
      <section className="mb-16">
        <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">
          Keyboard Shortcuts
        </h3>
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="space-y-3">
            {[
              { key: "Arrow Down / Space", action: "Scroll down" },
              { key: "Arrow Up", action: "Scroll up" },
              { key: "Home", action: "Jump to top" },
              { key: "End", action: "Jump to bottom" },
              { key: "H", action: "Toggle header" },
              { key: "Esc", action: "Close drawer" },
            ].map((shortcut) => (
              <div key={shortcut.key} className="flex items-center justify-between">
                <span className="text-xs text-white/40">{shortcut.action}</span>
                <kbd className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-xs font-mono text-teal-400">
                  {shortcut.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Back to reading */}
      <div className="text-center">
        <Link
          href="/read/1"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-medium transition-colors"
        >
          Start Reading
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
