"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export function LandingHero() {
  const [mounted, setMounted] = useState(false);
  const { config } = useSiteConfig();
  const landing = config.landing;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Radial gradient */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-maroon-800/10 rounded-full blur-[100px]" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      {/* Content */}
      <div
        className={`
          relative z-10 text-center px-6 max-w-3xl mx-auto
          transition-all duration-1000 ease-out
          ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
        `}
      >
        {/* Logo mark */}
        <div className="inline-flex items-center justify-center mb-8">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center shadow-2xl shadow-teal-900/40 border border-teal-500/20">
              <span className="text-3xl font-black text-white tracking-tighter">
                K
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md bg-maroon-700 border-2 border-[#0a0a0a]" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-none mb-4">
          kita
          <span className="text-teal-400">kun</span>
          <span className="text-maroon-500">03</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-white/40 font-light mb-2">
          {landing.heroSubtitle}
        </p>

        {/* Tagline */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-teal-600/50" />
          <p className="text-sm text-white/30 uppercase tracking-[0.3em]">
            {landing.heroTagline}
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-maroon-600/50" />
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={landing.ctaPrimary.link}
            className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-base shadow-xl shadow-teal-900/30 border border-teal-500/20 transition-all duration-300 hover:shadow-teal-800/40 hover:scale-[1.02]"
          >
            {landing.ctaPrimary.text}
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>

          <Link
            href={landing.ctaSecondary.link}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-medium text-base border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            {landing.ctaSecondary.text}
          </Link>
        </div>

        {/* Stats */}
        {landing.showStats && (
          <div
            className="mt-16 grid gap-8 max-w-sm mx-auto"
            style={{
              gridTemplateColumns: `repeat(${landing.stats.length}, minmax(0, 1fr))`,
            }}
          >
            {landing.stats.map((stat, i) => (
              <div key={i}>
                <p className={`text-2xl font-bold ${i === 0 ? "text-teal-400" : i === landing.stats.length - 1 ? "text-maroon-400" : "text-white"}`}>
                  {stat.value}
                </p>
                <p className="text-xs text-white/30 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-5 h-8 rounded-full border-2 border-white/10 flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-teal-500" />
        </div>
      </div>
    </section>
  );
}
