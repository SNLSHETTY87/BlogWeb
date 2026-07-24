"use client";

import { useRef, useState } from "react";
import { UploadCloud, X, Music2, ImageIcon, AlertCircle } from "lucide-react";
import { uploadFile } from "@/lib/uploadFile";

type FileDropzoneProps = {
  label: string;
  hint?: string;
  accept: string;
  kind: "image" | "audio";
  value: string | null;
  onChange: (url: string | null) => void;
};

export default function FileDropzone({ label, hint, accept, kind, value, onChange }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-black/80 dark:text-white/80">{label}</label>

      {value ? (
        <div className="flex items-center gap-3 rounded-xl border border-black/10 bg-black/[0.02] p-3 dark:border-white/10 dark:bg-white/[0.03]">
          {kind === "image" ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-14 w-14 rounded-lg object-cover" />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-amber-600/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400">
              <Music2 size={22} />
            </div>
          )}
          <p className="min-w-0 flex-1 truncate text-xs text-black/50 dark:text-white/50">{value}</p>
          <button
            type="button"
            onClick={() => onChange(null)}
            aria-label="Remove"
            className="shrink-0 rounded-full p-1.5 text-black/40 hover:bg-black/5 hover:text-black/70 dark:text-white/40 dark:hover:bg-white/10 dark:hover:text-white/70"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          className={`flex w-full items-center gap-3 rounded-xl border-2 border-dashed px-4 py-4 text-left transition-colors ${
            dragOver
              ? "border-amber-500 bg-amber-500/5"
              : "border-black/15 hover:border-black/25 dark:border-white/15 dark:hover:border-white/25"
          }`}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-black/5 text-black/50 dark:bg-white/10 dark:text-white/50">
            {uploading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : kind === "image" ? (
              <ImageIcon size={18} />
            ) : (
              <Music2 size={18} />
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{uploading ? "Uploading…" : "Drop a file or click to upload"}</p>
            {hint && <p className="text-xs text-black/45 dark:text-white/45">{hint}</p>}
          </div>
          <UploadCloud size={16} className="ml-auto shrink-0 text-black/25 dark:text-white/25" />
        </button>
      )}

      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
          <AlertCircle size={12} />
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          handleFile(file);
        }}
      />
    </div>
  );
}
