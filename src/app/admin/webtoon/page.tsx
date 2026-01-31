"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/admin/ui/Card";
import { TextInput } from "@/components/admin/ui/TextInput";
import { TextArea } from "@/components/admin/ui/TextArea";
import { Select } from "@/components/admin/ui/Select";
import { TagInput } from "@/components/admin/ui/TagInput";
import { ImageUpload } from "@/components/admin/ui/ImageUpload";
import { SectionHeader } from "@/components/admin/ui/SectionHeader";
import { useAdminApi } from "@/hooks/useAdminApi";
import { useAdminStore } from "@/store/adminStore";

interface WebtoonData {
  title: string;
  author: string;
  description: string;
  genre: string[];
  status: string;
  publishedDate: string;
  coverImage: string;
}

export default function WebtoonInfoPage() {
  const { get, put, upload } = useAdminApi();
  const { setHasUnsavedChanges } = useAdminStore();
  const [data, setData] = useState<WebtoonData | null>(null);

  useEffect(() => {
    get<WebtoonData>("/api/admin/webtoon").then((res) => {
      if (res.success && res.data) setData(res.data);
    });
  }, [get]);

  const update = <K extends keyof WebtoonData>(key: K, value: WebtoonData[K]) => {
    if (!data) return;
    setData({ ...data, [key]: value });
    setHasUnsavedChanges(true);
  };

  const save = () => {
    if (data) put("/api/admin/webtoon", data);
  };

  const handleCoverUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "cover");
    const res = await upload<{ path: string }>("/api/admin/upload", formData);
    if (res.success && res.data) {
      update("coverImage", res.data.path);
    }
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
          <h1 className="text-2xl font-bold text-white mb-1">Webtoon Info</h1>
          <p className="text-sm text-white/40">Webtoon metadata and details</p>
        </div>
        <button
          onClick={save}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition-colors"
        >
          Save Changes
        </button>
      </div>

      <Card>
        <SectionHeader title="Basic Info" />
        <div className="space-y-4">
          <TextInput
            label="Title"
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
          />
          <TextInput
            label="Author"
            value={data.author}
            onChange={(e) => update("author", e.target.value)}
          />
          <TextArea
            label="Description"
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
          />
          <TagInput
            label="Genres"
            tags={data.genre}
            onChange={(tags) => update("genre", tags)}
          />
          <Select
            label="Status"
            value={data.status}
            onChange={(e) => update("status", e.target.value)}
            options={[
              { value: "ongoing", label: "Ongoing" },
              { value: "completed", label: "Completed" },
              { value: "hiatus", label: "Hiatus" },
            ]}
          />
          <TextInput
            label="Published Date"
            type="date"
            value={data.publishedDate}
            onChange={(e) => update("publishedDate", e.target.value)}
          />
        </div>
      </Card>

      <Card>
        <SectionHeader title="Cover Image" />
        <ImageUpload
          value={data.coverImage || undefined}
          onUpload={handleCoverUpload}
        />
      </Card>
    </div>
  );
}
