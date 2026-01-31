"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/admin/ui/Card";
import { TextInput } from "@/components/admin/ui/TextInput";
import { Toggle } from "@/components/admin/ui/Toggle";
import { SectionHeader } from "@/components/admin/ui/SectionHeader";
import { useAdminApi } from "@/hooks/useAdminApi";
import { useAdminStore } from "@/store/adminStore";
import type { SiteConfig } from "@/types/admin";

type LandingConfig = SiteConfig["landing"];

export default function LandingPageEditor() {
  const { get, put } = useAdminApi();
  const { setHasUnsavedChanges } = useAdminStore();
  const [data, setData] = useState<LandingConfig | null>(null);

  useEffect(() => {
    get<LandingConfig>("/api/admin/pages/landing").then((res) => {
      if (res.success && res.data) setData(res.data);
    });
  }, [get]);

  const update = (updater: (prev: LandingConfig) => LandingConfig) => {
    if (!data) return;
    setData(updater(data));
    setHasUnsavedChanges(true);
  };

  const save = () => {
    if (data) put("/api/admin/pages/landing", data);
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Landing Page</h1>
          <p className="text-sm text-white/40">Hero section and call-to-action</p>
        </div>
        <button
          onClick={save}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition-colors"
        >
          Save Changes
        </button>
      </div>

      <Card>
        <SectionHeader title="Hero Content" />
        <div className="space-y-4">
          <TextInput
            label="Title"
            value={data.heroTitle}
            onChange={(e) => update((d) => ({ ...d, heroTitle: e.target.value }))}
          />
          <TextInput
            label="Subtitle"
            value={data.heroSubtitle}
            onChange={(e) => update((d) => ({ ...d, heroSubtitle: e.target.value }))}
          />
          <TextInput
            label="Tagline"
            value={data.heroTagline}
            onChange={(e) => update((d) => ({ ...d, heroTagline: e.target.value }))}
          />
        </div>
      </Card>

      <Card>
        <SectionHeader title="CTA Buttons" />
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Primary Button Text"
              value={data.ctaPrimary.text}
              onChange={(e) =>
                update((d) => ({
                  ...d,
                  ctaPrimary: { ...d.ctaPrimary, text: e.target.value },
                }))
              }
            />
            <TextInput
              label="Primary Button Link"
              value={data.ctaPrimary.link}
              onChange={(e) =>
                update((d) => ({
                  ...d,
                  ctaPrimary: { ...d.ctaPrimary, link: e.target.value },
                }))
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Secondary Button Text"
              value={data.ctaSecondary.text}
              onChange={(e) =>
                update((d) => ({
                  ...d,
                  ctaSecondary: { ...d.ctaSecondary, text: e.target.value },
                }))
              }
            />
            <TextInput
              label="Secondary Button Link"
              value={data.ctaSecondary.link}
              onChange={(e) =>
                update((d) => ({
                  ...d,
                  ctaSecondary: { ...d.ctaSecondary, link: e.target.value },
                }))
              }
            />
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeader title="Stats" />
        <Toggle
          label="Show Stats"
          checked={data.showStats}
          onChange={(checked) => update((d) => ({ ...d, showStats: checked }))}
        />
        {data.showStats && (
          <div className="mt-4 space-y-3">
            {data.stats.map((stat, i) => (
              <div key={i} className="grid grid-cols-2 gap-4">
                <TextInput
                  label={`Stat ${i + 1} Value`}
                  value={stat.value}
                  onChange={(e) =>
                    update((d) => {
                      const newStats = [...d.stats];
                      newStats[i] = { ...newStats[i], value: e.target.value };
                      return { ...d, stats: newStats };
                    })
                  }
                />
                <TextInput
                  label={`Stat ${i + 1} Label`}
                  value={stat.label}
                  onChange={(e) =>
                    update((d) => {
                      const newStats = [...d.stats];
                      newStats[i] = { ...newStats[i], label: e.target.value };
                      return { ...d, stats: newStats };
                    })
                  }
                />
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                update((d) => ({
                  ...d,
                  stats: [...d.stats, { label: "Label", value: "0" }],
                }))
              }
              className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
            >
              + Add stat
            </button>
          </div>
        )}
      </Card>
    </div>
  );
}
