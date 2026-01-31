"use client";

import Link from "next/link";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export function LandingFooter() {
  const { config } = useSiteConfig();
  const footer = config.footer;

  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-700 to-teal-900 flex items-center justify-center border border-teal-600/20">
              <span className="text-sm font-black text-white">K</span>
            </div>
            <span className="text-sm font-semibold text-white/60">
              {footer.brand}
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            {footer.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-white/30 hover:text-teal-400 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-xs text-white/20">
            &copy; {new Date().getFullYear()} {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
