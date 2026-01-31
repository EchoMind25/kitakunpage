"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/admin/ui/Card";
import { TextInput } from "@/components/admin/ui/TextInput";
import { TextArea } from "@/components/admin/ui/TextArea";
import { Select } from "@/components/admin/ui/Select";
import { SectionHeader } from "@/components/admin/ui/SectionHeader";
import { useAdminApi } from "@/hooks/useAdminApi";

export default function NewChapterPage() {
  const { post } = useAdminApi();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    publishDate: new Date().toISOString().split("T")[0],
    status: "draft",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await post<{ id: number }>("/api/admin/chapters", form);
    if (res.success && res.data) {
      router.push(`/admin/chapters/${res.data.id}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">New Chapter</h1>
        <p className="text-sm text-white/40">
          Create a new chapter and upload panels
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <SectionHeader title="Chapter Details" />
          <div className="space-y-4">
            <TextInput
              label="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Chapter 3: The Title"
              required
            />
            <TextInput
              label="Publish Date"
              type="date"
              value={form.publishDate}
              onChange={(e) => setForm((f) => ({ ...f, publishDate: e.target.value }))}
            />
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
              options={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
                { value: "scheduled", label: "Scheduled" },
              ]}
            />
            <TextArea
              label="Notes"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Author notes for this chapter..."
            />
          </div>
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition-colors"
            >
              Create Chapter
            </button>
          </div>
        </Card>
      </form>
    </div>
  );
}
