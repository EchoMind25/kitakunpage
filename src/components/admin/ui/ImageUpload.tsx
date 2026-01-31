"use client";

import { useCallback, useState, DragEvent } from "react";

interface ImageUploadProps {
  label?: string;
  value?: string;
  onUpload: (file: File) => void;
  accept?: string;
}

export function ImageUpload({
  label,
  value,
  onUpload,
  accept = "image/*",
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onUpload(file);
    },
    [onUpload]
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-white/60 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative flex flex-col items-center justify-center w-full h-40 rounded-xl border-2 border-dashed transition-colors cursor-pointer ${
          isDragging
            ? "border-teal-500 bg-teal-500/5"
            : "border-white/10 bg-white/[0.02] hover:border-white/20"
        }`}
      >
        {value ? (
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-contain rounded-xl"
          />
        ) : (
          <div className="text-center">
            <svg
              className="w-8 h-8 text-white/20 mx-auto mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
              />
            </svg>
            <p className="text-xs text-white/30">
              Drop image here or click to browse
            </p>
          </div>
        )}
        <input
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}
