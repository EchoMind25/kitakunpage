"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/admin/ui/Card";
import { TextInput } from "@/components/admin/ui/TextInput";
import { TextArea } from "@/components/admin/ui/TextArea";
import { ImageUpload } from "@/components/admin/ui/ImageUpload";
import { SectionHeader } from "@/components/admin/ui/SectionHeader";
import { useAdminApi } from "@/hooks/useAdminApi";
import { useAdminStore } from "@/store/adminStore";
import type { SiteConfig } from "@/types/admin";

export default function SiteSettingsPage() {
  const { get, put, upload } = useAdminApi();
  const { setHasUnsavedChanges } = useAdminStore();
  const [config, setConfig] = useState<SiteConfig | null>(null);

  useEffect(() => {
    get<SiteConfig>("/api/admin/site").then((res) => {
      if (res.success && res.data) setConfig(res.data);
    });
  }, [get]);

  const update = (path: string, value: string) => {
    if (!config) return;
    const keys = path.split(".");
    const newConfig = { ...config };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let obj: any = newConfig;
    for (let i = 0; i < keys.length - 1; i++) {
      obj[keys[i]] = { ...obj[keys[i]] };
      obj = obj[keys[i]];
    }
    obj[keys[keys.length - 1]] = value;
    setConfig(newConfig);
    setHasUnsavedChanges(true);
  };

  const save = () => {
    if (config) put("/api/admin/site", config);
  };

  const handleImageUpload = async (file: File, type: string, configPath: string) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);
    const res = await upload<{ path: string }>("/api/admin/upload", formData);
    if (res.success && res.data) {
      update(configPath, res.data.path);
    }
  };

  if (!config) {
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
          <h1 className="text-2xl font-bold text-white mb-1">Site Settings</h1>
          <p className="text-sm text-white/40">General site configuration</p>
        </div>
        <button
          onClick={save}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition-colors"
        >
          Save Changes
        </button>
      </div>

      {/* Site Info */}
      <Card>
        <SectionHeader title="Site Information" />
        <div className="space-y-4">
          <TextInput
            label="Site Title"
            value={config.site.title}
            onChange={(e) => update("site.title", e.target.value)}
          />
          <TextInput
            label="Tagline"
            value={config.site.tagline}
            onChange={(e) => update("site.tagline", e.target.value)}
          />
          <TextArea
            label="Description"
            value={config.site.description}
            onChange={(e) => update("site.description", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <ImageUpload
              label="Logo"
              value={config.site.logo || undefined}
              onUpload={(file) => handleImageUpload(file, "logo", "site.logo")}
            />
            <ImageUpload
              label="Favicon"
              value={config.site.favicon || undefined}
              onUpload={(file) => handleImageUpload(file, "favicon", "site.favicon")}
            />
          </div>
        </div>
      </Card>

      {/* Author */}
      <Card>
        <SectionHeader title="Author" />
        <div className="space-y-4">
          <TextInput
            label="Name"
            value={config.author.name}
            onChange={(e) => update("author.name", e.target.value)}
          />
          <TextInput
            label="Role"
            value={config.author.role}
            onChange={(e) => update("author.role", e.target.value)}
          />
          <TextArea
            label="Bio"
            value={config.author.bio}
            onChange={(e) => update("author.bio", e.target.value)}
          />
          <ImageUpload
            label="Avatar"
            value={config.author.avatar || undefined}
            onUpload={(file) => handleImageUpload(file, "avatar", "author.avatar")}
          />
        </div>
      </Card>

      {/* Social Links */}
      <Card>
        <SectionHeader title="Social Links" />
        <div className="space-y-4">
          <TextInput
            label="Twitter"
            value={config.social.twitter}
            onChange={(e) => update("social.twitter", e.target.value)}
            placeholder="https://twitter.com/..."
          />
          <TextInput
            label="Instagram"
            value={config.social.instagram}
            onChange={(e) => update("social.instagram", e.target.value)}
            placeholder="https://instagram.com/..."
          />
          <TextInput
            label="Patreon"
            value={config.social.patreon}
            onChange={(e) => update("social.patreon", e.target.value)}
            placeholder="https://patreon.com/..."
          />
          <TextInput
            label="Ko-fi"
            value={config.social.kofi}
            onChange={(e) => update("social.kofi", e.target.value)}
            placeholder="https://ko-fi.com/..."
          />
          <TextInput
            label="Website"
            value={config.social.website}
            onChange={(e) => update("social.website", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </Card>
    </div>
  );
}
