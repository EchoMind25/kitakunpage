"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/admin/ui/Card";
import { TextInput } from "@/components/admin/ui/TextInput";
import { TextArea } from "@/components/admin/ui/TextArea";
import { Select } from "@/components/admin/ui/Select";
import { SectionHeader } from "@/components/admin/ui/SectionHeader";
import { PanelUploader } from "@/components/admin/ui/PanelUploader";
import { PanelGrid } from "@/components/admin/ui/PanelGrid";
import { ConfirmDialog } from "@/components/admin/ui/ConfirmDialog";
import { useAdminApi } from "@/hooks/useAdminApi";
import { useAdminStore } from "@/store/adminStore";
import type { ChapterMetadata } from "@/types/webtoon";

export default function ChapterEditorPage() {
  const params = useParams();
  const chapterId = params.id as string;
  const { get, put, upload, del } = useAdminApi();
  const { setHasUnsavedChanges } = useAdminStore();
  const [chapter, setChapter] = useState<ChapterMetadata | null>(null);
  const [status, setStatus] = useState("published");
  const [uploading, setUploading] = useState(false);
  const [deletePanelId, setDeletePanelId] = useState<number | null>(null);

  const loadChapter = useCallback(() => {
    get<ChapterMetadata>(`/api/admin/chapters/${chapterId}`).then((res) => {
      if (res.success && res.data) setChapter(res.data);
    });
  }, [get, chapterId]);

  useEffect(() => {
    loadChapter();
  }, [loadChapter]);

  const updateField = (key: keyof ChapterMetadata, value: string | number) => {
    if (!chapter) return;
    setChapter({ ...chapter, [key]: value });
    setHasUnsavedChanges(true);
  };

  const save = () => {
    if (!chapter) return;
    put(`/api/admin/chapters/${chapterId}`, {
      title: chapter.title,
      publishDate: chapter.publishDate,
      notes: chapter.notes,
      estimatedReadTime: chapter.estimatedReadTime,
      status,
    });
  };

  const handlePanelUpload = async (files: File[]) => {
    setUploading(true);
    const formData = new FormData();
    files.forEach((f) => formData.append("panels", f));
    const res = await upload<ChapterMetadata>(
      `/api/admin/chapters/${chapterId}/panels`,
      formData
    );
    if (res.success && res.data) {
      setChapter(res.data);
    }
    setUploading(false);
  };

  const handleReorder = async (panelOrder: number[]) => {
    await put(`/api/admin/chapters/${chapterId}/panels`, { panelOrder });
    loadChapter();
  };

  const handleDeletePanel = async () => {
    if (deletePanelId === null) return;
    const res = await del<ChapterMetadata>(
      `/api/admin/chapters/${chapterId}/panels/${deletePanelId}`
    );
    if (res.success && res.data) {
      setChapter(res.data);
    }
    setDeletePanelId(null);
  };

  if (!chapter) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Edit Chapter {chapter.chapterId}
          </h1>
          <p className="text-sm text-white/40">{chapter.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={`/read/${chapter.chapterId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white text-sm font-medium transition-colors"
          >
            Preview
          </a>
          <button
            onClick={save}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-sm font-medium transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Metadata */}
      <Card>
        <SectionHeader title="Chapter Details" />
        <div className="space-y-4">
          <TextInput
            label="Title"
            value={chapter.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <TextInput
              label="Publish Date"
              type="date"
              value={chapter.publishDate}
              onChange={(e) => updateField("publishDate", e.target.value)}
            />
            <Select
              label="Status"
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setHasUnsavedChanges(true);
              }}
              options={[
                { value: "published", label: "Published" },
                { value: "draft", label: "Draft" },
                { value: "scheduled", label: "Scheduled" },
              ]}
            />
          </div>
          <TextInput
            label="Read Time (minutes)"
            type="number"
            value={chapter.estimatedReadTime}
            onChange={(e) =>
              updateField("estimatedReadTime", Number(e.target.value))
            }
          />
          <TextArea
            label="Notes"
            value={chapter.notes}
            onChange={(e) => updateField("notes", e.target.value)}
          />
        </div>
      </Card>

      {/* Panel Upload */}
      <Card>
        <SectionHeader
          title="Panels"
          description={`${chapter.totalPanels} panels`}
        />
        <PanelUploader onUpload={handlePanelUpload} uploading={uploading} />
      </Card>

      {/* Panel Grid */}
      {chapter.panels.length > 0 && (
        <Card>
          <SectionHeader
            title="Panel Order"
            description="Drag to reorder, hover to delete"
          />
          <PanelGrid
            panels={chapter.panels}
            chapterId={chapter.chapterId}
            onReorder={handleReorder}
            onDelete={(id) => setDeletePanelId(id)}
          />
        </Card>
      )}

      <ConfirmDialog
        open={deletePanelId !== null}
        title="Delete Panel"
        message="Are you sure you want to delete this panel? The image file will be permanently removed."
        confirmLabel="Delete"
        destructive
        onConfirm={handleDeletePanel}
        onCancel={() => setDeletePanelId(null)}
      />
    </div>
  );
}
