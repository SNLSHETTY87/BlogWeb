"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { uploadFile } from "@/lib/uploadFile";

const PostEditor = dynamic(() => import("@/components/editor/PostEditor"), { ssr: false });

type PostFormValues = {
  id?: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  tags: string[];
  coverImage: string | null;
  backgroundAudioUrl: string | null;
  published: boolean;
};

export default function PostForm({ initial }: { initial?: PostFormValues }) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [tags, setTags] = useState((initial?.tags ?? []).join(", "));
  const [coverImage, setCoverImage] = useState<string | null>(initial?.coverImage ?? null);
  const [backgroundAudioUrl, setBackgroundAudioUrl] = useState<string | null>(
    initial?.backgroundAudioUrl ?? null
  );
  const [published, setPublished] = useState(initial?.published ?? true);
  const [contentHtml, setContentHtml] = useState(initial?.contentHtml ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [audioUploading, setAudioUploading] = useState(false);

  const isEdit = Boolean(initial?.id);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!contentHtml.trim()) {
      setError("Post body can't be empty.");
      return;
    }

    setSaving(true);
    const payload = {
      title,
      excerpt,
      contentHtml,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      coverImage,
      backgroundAudioUrl,
      published,
    };

    const res = await fetch(isEdit ? `/api/posts/${initial!.id}` : "/api/posts", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Failed to save post.");
      return;
    }

    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title"
        className="rounded-lg border border-black/10 px-3 py-2 text-lg font-medium dark:border-white/10 dark:bg-transparent"
      />

      <textarea
        value={excerpt}
        onChange={(e) => setExcerpt(e.target.value)}
        placeholder="Short excerpt shown on the home page"
        rows={2}
        className="rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-transparent"
      />

      <input
        type="text"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Tags, comma separated (e.g. psychology, habits)"
        className="rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-transparent"
      />

      <div>
        <label className="mb-1 block text-sm font-medium">Cover image (optional)</label>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setCoverUploading(true);
            const url = await uploadFile(file);
            setCoverImage(url);
            setCoverUploading(false);
          }}
        />
        {coverUploading && <p className="mt-1 text-xs">Uploading…</p>}
        {coverImage && <p className="mt-1 break-all text-xs text-black/50 dark:text-white/50">{coverImage}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">
          Background audio (optional — plays quietly while someone reads, they can turn it off)
        </label>
        <input
          type="file"
          accept="audio/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setAudioUploading(true);
            const url = await uploadFile(file);
            setBackgroundAudioUrl(url);
            setAudioUploading(false);
          }}
        />
        {audioUploading && <p className="mt-1 text-xs">Uploading…</p>}
        {backgroundAudioUrl && (
          <p className="mt-1 break-all text-xs text-black/50 dark:text-white/50">{backgroundAudioUrl}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Post body</label>
        <PostEditor initialHtml={contentHtml} onChange={setContentHtml} />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Published (visible to readers)
      </label>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <button
        disabled={saving}
        className="w-fit rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {saving ? "Saving…" : isEdit ? "Save changes" : "Publish post"}
      </button>
    </form>
  );
}
