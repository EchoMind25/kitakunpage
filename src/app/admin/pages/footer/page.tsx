"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/admin/ui/Card";
import { TextInput } from "@/components/admin/ui/TextInput";
import { SectionHeader } from "@/components/admin/ui/SectionHeader";
import { useAdminApi } from "@/hooks/useAdminApi";
import { useAdminStore } from "@/store/adminStore";
import type { SiteConfig } from "@/types/admin";

type FooterConfig = SiteConfig["footer"];

export default function FooterPageEditor() {
  const { get, put } = useAdminApi();
  const { setHasUnsavedChanges } = useAdminStore();
  const [data, setData] = useState<FooterConfig | null>(null);

  useEffect(() => {
    get<FooterConfig>("/api/admin/pages/footer").then((res) => {
      if (res.success && res.data) setData(res.data);
    });
  }, [get]);

  const update = (updater: (prev: FooterConfig) => FooterConfig) => {
    if (!data) return;
    setData(updater(data));
    setHasUnsavedChanges(true);
  };

  const save = () => {
    if (data) put("/api/admin/pages/footer", data);
  };

  const addLink = () => {
    update((d) => ({
      ...d,
      links: [...d.links, { label: "Link", href: "/" }],
    }));
  };

  const removeLink = (index: number) => {
    update((d) => ({
      ...d,
      links: d.links.filter((_, i) => i !== index),
    }));
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
          <h1 className="text-2xl font-bold text-white mb-1">Footer</h1>
          <p className="text-sm text-white/40">Footer branding and links</p>
        </div>
        <button
          onClick={save}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition-colors"
        >
          Save Changes
        </button>
      </div>

      <Card>
        <SectionHeader title="Branding" />
        <div className="space-y-4">
          <TextInput
            label="Brand Name"
            value={data.brand}
            onChange={(e) => update((d) => ({ ...d, brand: e.target.value }))}
          />
          <TextInput
            label="Copyright Text"
            value={data.copyright}
            onChange={(e) => update((d) => ({ ...d, copyright: e.target.value }))}
          />
        </div>
      </Card>

      <Card>
        <SectionHeader
          title="Links"
          action={
            <button
              onClick={addLink}
              className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
            >
              + Add Link
            </button>
          }
        />
        <div className="space-y-3">
          {data.links.map((link, i) => (
            <div key={i} className="flex items-end gap-3">
              <div className="flex-1">
                <TextInput
                  label="Label"
                  value={link.label}
                  onChange={(e) =>
                    update((d) => {
                      const newLinks = [...d.links];
                      newLinks[i] = { ...newLinks[i], label: e.target.value };
                      return { ...d, links: newLinks };
                    })
                  }
                />
              </div>
              <div className="flex-1">
                <TextInput
                  label="URL"
                  value={link.href}
                  onChange={(e) =>
                    update((d) => {
                      const newLinks = [...d.links];
                      newLinks[i] = { ...newLinks[i], href: e.target.value };
                      return { ...d, links: newLinks };
                    })
                  }
                />
              </div>
              <button
                onClick={() => removeLink(i)}
                className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-600/20 transition-colors flex-shrink-0"
              >
                ×
              </button>
            </div>
          ))}
          {data.links.length === 0 && (
            <p className="text-sm text-white/20">No links added yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
