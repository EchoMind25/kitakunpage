"use client";

import { memo, useState, useRef, useEffect } from "react";
import type { VirtualPanel } from "@/types";

interface PanelImageProps {
  panel: VirtualPanel;
}

export const PanelImage = memo(function PanelImage({ panel }: PanelImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Reset state when panel changes
    setLoaded(false);
    setError(false);
  }, [panel.src]);

  const aspectRatio = panel.width && panel.height ? panel.width / panel.height : 800 / 1200;

  return (
    <div
      className="panel-container relative w-full mx-auto"
      style={{
        maxWidth: `min(${panel.width}px, 100%)`,
        aspectRatio: String(aspectRatio),
      }}
      data-panel-id={panel.globalIndex}
    >
      {/* BlurHash / skeleton placeholder */}
      {!loaded && !error && (
        <div
          className="absolute inset-0 animate-pulse rounded-sm"
          style={{
            background: `linear-gradient(135deg, rgba(13,148,136,0.08) 0%, rgba(127,29,29,0.06) 100%)`,
          }}
        />
      )}

      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white/5 rounded-sm">
          <div className="text-center text-white/30">
            <svg className="w-8 h-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
            <span className="text-xs">Panel {panel.id}</span>
          </div>
        </div>
      ) : (
        <img
          ref={imgRef}
          src={panel.src}
          alt={`Panel ${panel.id}`}
          width={panel.width}
          height={panel.height}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`
            panel-image w-full h-auto block
            transition-opacity duration-300 ease-out
            ${loaded ? "opacity-100" : "opacity-0"}
          `}
          style={{ contentVisibility: "auto" }}
        />
      )}
    </div>
  );
});
