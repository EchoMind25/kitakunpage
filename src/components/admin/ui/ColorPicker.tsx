"use client";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-white/60 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/40"
        />
        <div
          className="w-10 h-10 rounded-lg border border-white/10"
          style={{ backgroundColor: value }}
        />
      </div>
    </div>
  );
}
