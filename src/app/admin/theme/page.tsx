"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/admin/ui/Card";
import { ColorPicker } from "@/components/admin/ui/ColorPicker";
import { SectionHeader } from "@/components/admin/ui/SectionHeader";
import { useAdminApi } from "@/hooks/useAdminApi";
import { useAdminStore } from "@/store/adminStore";
import type { SiteConfig } from "@/types/admin";

const defaults = {
  primary: "#0d9488",
  accent: "#7f1d1d",
  background: "#0a0a0a",
  text: "#ffffff",
};

export default function ThemeEditorPage() {
  const { get, put } = useAdminApi();
  const { setHasUnsavedChanges } = useAdminStore();
  const [theme, setTheme] = useState(defaults);

  useEffect(() => {
    get<SiteConfig>("/api/admin/site").then((res) => {
      if (res.success && res.data?.theme) {
        setTheme(res.data.theme);
      }
    });
  }, [get]);

  const updateColor = (key: keyof typeof defaults, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const save = async () => {
    const res = await get<SiteConfig>("/api/admin/site");
    if (res.success && res.data) {
      await put("/api/admin/site", { ...res.data, theme });
    }
  };

  const reset = () => {
    setTheme(defaults);
    setHasUnsavedChanges(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Theme Editor</h1>
          <p className="text-sm text-white/40">Customize your site colors</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={save}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      <Card>
        <SectionHeader title="Colors" />
        <div className="space-y-6">
          <ColorPicker
            label="Primary"
            value={theme.primary}
            onChange={(v) => updateColor("primary", v)}
          />
          <ColorPicker
            label="Accent"
            value={theme.accent}
            onChange={(v) => updateColor("accent", v)}
          />
          <ColorPicker
            label="Background"
            value={theme.background}
            onChange={(v) => updateColor("background", v)}
          />
          <ColorPicker
            label="Text"
            value={theme.text}
            onChange={(v) => updateColor("text", v)}
          />
        </div>
      </Card>

      {/* Live Preview */}
      <Card>
        <SectionHeader title="Live Preview" />
        <div
          className="rounded-xl p-8 border border-white/5"
          style={{ backgroundColor: theme.background }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: theme.primary }}
            >
              <span className="text-sm font-black" style={{ color: theme.text }}>
                K
              </span>
            </div>
            <div>
              <p className="text-sm font-bold" style={{ color: theme.text }}>
                kitakun03
              </p>
              <p
                className="text-xs"
                style={{ color: theme.text, opacity: 0.4 }}
              >
                Webtoon Reader
              </p>
            </div>
          </div>
          <p className="text-sm mb-4" style={{ color: theme.text, opacity: 0.6 }}>
            This is a preview of how your theme colors will look on the site.
          </p>
          <div className="flex gap-3">
            <span
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{
                backgroundColor: theme.primary,
                color: theme.text,
              }}
            >
              Primary Button
            </span>
            <span
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{
                backgroundColor: theme.accent,
                color: theme.text,
              }}
            >
              Accent Button
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
