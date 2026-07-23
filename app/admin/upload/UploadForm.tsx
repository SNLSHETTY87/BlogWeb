"use client";

import { useState } from "react";

export default function UploadForm() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus("uploading");
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      setStatus("error");
      return;
    }
    const data = await res.json();
    setUrl(data.url);
    setStatus("idle");
  }

  return (
    <div className="mt-6 flex flex-col gap-4">
      <input
        type="file"
        accept="image/*,audio/*"
        onChange={handleChange}
        className="text-sm"
      />
      {status === "uploading" && <p className="text-sm">Uploading...</p>}
      {status === "error" && <p className="text-sm text-red-600">Upload failed.</p>}
      {url && (
        <div className="rounded-lg border border-black/10 p-3 text-sm dark:border-white/10">
          <p className="break-all font-mono">{url}</p>
        </div>
      )}
    </div>
  );
}
