"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/admin/ui/Card";
import { TextInput } from "@/components/admin/ui/TextInput";
import { TextArea } from "@/components/admin/ui/TextArea";
import { Toggle } from "@/components/admin/ui/Toggle";
import { SectionHeader } from "@/components/admin/ui/SectionHeader";
import { useAdminApi } from "@/hooks/useAdminApi";
import { useAdminStore } from "@/store/adminStore";
import type { SiteConfig } from "@/types/admin";

type AboutConfig = SiteConfig["about"];

export default function AboutPageEditor() {
  const { get, put } = useAdminApi();
  const { setHasUnsavedChanges } = useAdminStore();
  const [data, setData] = useState<AboutConfig | null>(null);

  useEffect(() => {
    get<AboutConfig>("/api/admin/pages/about").then((res) => {
      if (res.success && res.data) setData(res.data);
    });
  }, [get]);

  const update = (updater: (prev: AboutConfig) => AboutConfig) => {
    if (!data) return;
    setData(updater(data));
    setHasUnsavedChanges(true);
  };

  const save = () => {
    if (data) put("/api/admin/pages/about", data);
  };

  const addSection = () => {
    update((d) => ({
      ...d,
      sections: [
        ...d.sections,
        {
          id: `section-${Date.now()}`,
          title: "New Section",
          content: "",
          visible: true,
        },
      ],
    }));
  };

  const removeSection = (index: number) => {
    update((d) => ({
      ...d,
      sections: d.sections.filter((_, i) => i !== index),
    }));
  };

  const moveSection = (index: number, direction: -1 | 1) => {
    update((d) => {
      const newSections = [...d.sections];
      const target = index + direction;
      if (target < 0 || target >= newSections.length) return d;
      [newSections[index], newSections[target]] = [
        newSections[target],
        newSections[index],
      ];
      return { ...d, sections: newSections };
    });
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
          <h1 className="text-2xl font-bold text-white mb-1">About Page</h1>
          <p className="text-sm text-white/40">Edit about page sections</p>
        </div>
        <button
          onClick={save}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition-colors"
        >
          Save Changes
        </button>
      </div>

      {data.sections.map((section, i) => (
        <Card key={section.id}>
          <div className="flex items-center justify-between mb-4">
            <SectionHeader title={`Section ${i + 1}`} />
            <div className="flex items-center gap-2">
              <button
                onClick={() => moveSection(i, -1)}
                disabled={i === 0}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-20 transition-colors"
              >
                ↑
              </button>
              <button
                onClick={() => moveSection(i, 1)}
                disabled={i === data.sections.length - 1}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white disabled:opacity-20 transition-colors"
              >
                ↓
              </button>
              <button
                onClick={() => removeSection(i)}
                className="w-7 h-7 rounded-lg bg-red-600/10 border border-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-600/20 transition-colors"
              >
                ×
              </button>
            </div>
          </div>
          <div className="space-y-4">
            <TextInput
              label="Title"
              value={section.title}
              onChange={(e) =>
                update((d) => {
                  const newSections = [...d.sections];
                  newSections[i] = { ...newSections[i], title: e.target.value };
                  return { ...d, sections: newSections };
                })
              }
            />
            <TextArea
              label="Content"
              value={section.content}
              onChange={(e) =>
                update((d) => {
                  const newSections = [...d.sections];
                  newSections[i] = { ...newSections[i], content: e.target.value };
                  return { ...d, sections: newSections };
                })
              }
            />
            <Toggle
              label="Visible"
              checked={section.visible}
              onChange={(checked) =>
                update((d) => {
                  const newSections = [...d.sections];
                  newSections[i] = { ...newSections[i], visible: checked };
                  return { ...d, sections: newSections };
                })
              }
            />
          </div>
        </Card>
      ))}

      <button
        onClick={addSection}
        className="w-full py-3 rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 text-sm text-white/30 hover:text-white/50 transition-colors"
      >
        + Add Section
      </button>
    </div>
  );
}
