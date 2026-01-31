"use client";

import { useCallback, useState, DragEvent } from "react";

interface PanelUploaderProps {
  onUpload: (files: File[]) => void;
  uploading?: boolean;
}

export function PanelUploader({ onUpload, uploading }: PanelUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (files.length > 0) onUpload(files);
    },
    [onUpload]
  );

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      className={`relative flex flex-col items-center justify-center w-full py-12 rounded-xl border-2 border-dashed transition-colors ${
        isDragging
          ? "border-teal-500 bg-teal-500/5"
          : "border-white/10 bg-white/[0.02] hover:border-white/20"
      } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
    >
      <svg
        className="w-10 h-10 text-white/20 mb-3"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
        />
      </svg>
      <p className="text-sm text-white/40 mb-1">
        {uploading ? "Uploading..." : "Drop panel images here"}
      </p>
      <p className="text-xs text-white/20">or click to select multiple files</p>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length > 0) onUpload(files);
        }}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
    </div>
  );
}
