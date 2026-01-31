"use client";

import { useState, useCallback, useRef } from "react";
import type { Panel } from "@/types/webtoon";

interface PanelGridProps {
  panels: Panel[];
  chapterId: number;
  onReorder: (panelOrder: number[]) => void;
  onDelete: (panelId: number) => void;
}

export function PanelGrid({ panels, chapterId, onReorder, onDelete }: PanelGridProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);
  const dragRef = useRef<number | null>(null);

  const padId = String(chapterId).padStart(3, "0");

  const handleDragStart = useCallback((idx: number) => {
    setDragIdx(idx);
    dragRef.current = idx;
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, idx: number) => {
      e.preventDefault();
      if (idx !== overIdx) setOverIdx(idx);
    },
    [overIdx]
  );

  const handleDrop = useCallback(
    (dropIdx: number) => {
      if (dragRef.current === null || dragRef.current === dropIdx) {
        setDragIdx(null);
        setOverIdx(null);
        return;
      }
      const newPanels = [...panels];
      const [moved] = newPanels.splice(dragRef.current, 1);
      newPanels.splice(dropIdx, 0, moved);
      onReorder(newPanels.map((p) => p.id));
      setDragIdx(null);
      setOverIdx(null);
    },
    [panels, onReorder]
  );

  if (panels.length === 0) {
    return (
      <div className="text-center py-12 text-white/20 text-sm">
        No panels yet. Upload some images above.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
      {panels.map((panel, idx) => (
        <div
          key={panel.id}
          draggable
          onDragStart={() => handleDragStart(idx)}
          onDragOver={(e) => handleDragOver(e, idx)}
          onDrop={() => handleDrop(idx)}
          onDragEnd={() => {
            setDragIdx(null);
            setOverIdx(null);
          }}
          className={`group relative rounded-lg overflow-hidden border transition-all cursor-grab active:cursor-grabbing ${
            dragIdx === idx
              ? "opacity-30 border-teal-500"
              : overIdx === idx
              ? "border-teal-500 scale-105"
              : "border-white/10 hover:border-white/20"
          }`}
        >
          <div className="aspect-[3/4] bg-white/5">
            <img
              src={`/webtoon/chapters/${padId}/panels/${panel.filename}`}
              alt={`Panel ${panel.id}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <span className="text-[10px] text-white/60 font-mono">
              #{panel.id}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(panel.id);
            }}
            className="absolute top-1 right-1 w-6 h-6 rounded-md bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
