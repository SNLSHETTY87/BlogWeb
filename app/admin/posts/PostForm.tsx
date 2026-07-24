"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { AlertCircle } from "lucide-react";
import FileDropzone from "@/components/admin/FileDropzone";
import TagInput from "@/components/admin/TagInput";
import Switch from "@/components/admin/Switch";

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
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [coverImage, setCoverImage] = useState<string | null>(initial?.coverImage ?? null);
  const [backgroundAudioUrl, setBackgroundAudioUrl] = useState<string | null>(
    initial?.backgroundAudioUrl ?? null
  );
  const [published, setPublished] = useState(initial?.published ?? true);
  const [contentHtml, setContentHtml] = useState(initial?.contentHtml ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    const payload = { title, excerpt, contentHtml, tags, coverImage, backgroundAudioUrl, published };

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-8 pb-28">
      <div>
        <textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post title"
          rows={1}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = `${el.scrollHeight}px`;
          }}
          className="w-full resize-none overflow-hidden bg-transparent text-3xl font-bold tracking-tight outline-none placeholder:text-black/25 md:text-4xl dark:placeholder:text-white/25"
        />
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="One-line excerpt shown on the home page…"
          rows={1}
          className="mt-2 w-full resize-none bg-transparent text-base text-black/60 outline-none placeholder:text-black/30 dark:text-white/60 dark:placeholder:text-white/30"
        />
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-black/10 bg-black/[0.015] p-5 dark:border-white/10 dark:bg-white/[0.02]">
        <div>
          <label className="mb-2 block text-sm font-medium text-black/80 dark:text-white/80">Tags</label>
          <TagInput tags={tags} onChange={setTags} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <FileDropzone
            label="Cover image"
            hint="Shown on the home page card"
            accept="image/*"
            kind="image"
            value={coverImage}
            onChange={setCoverImage}
          />
          <FileDropzone
            label="Background audio"
            hint="Plays quietly while someone reads — they can turn it off"
            accept="audio/*"
            kind="audio"
            value={backgroundAudioUrl}
            onChange={setBackgroundAudioUrl}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-black/80 dark:text-white/80">Post body</label>
        <PostEditor initialHtml={contentHtml} onChange={setContentHtml} />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-[#0a0a0a]/90">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-4">
            <Switch checked={published} onChange={setPublished} label={published ? "Published" : "Draft"} />
            {error && (
              <span className="flex items-center gap-1.5 text-sm text-red-600 dark:text-red-400">
                <AlertCircle size={14} />
                {error}
              </span>
            )}
          </div>
          <button
            disabled={saving}
            className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Publish post"}
          </button>
        </div>
      </div>
    </form>
  );
}
