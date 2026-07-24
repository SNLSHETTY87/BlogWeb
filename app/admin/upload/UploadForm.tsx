"use client";

import { useState } from "react";
import FileDropzone from "@/components/admin/FileDropzone";

export default function UploadForm() {
  const [url, setUrl] = useState<string | null>(null);

  return (
    <div className="mt-6">
      <FileDropzone
        label="File"
        hint="Images or audio"
        accept="image/*,audio/*"
        kind={url?.match(/\.(mp3|wav|m4a|ogg)$/i) ? "audio" : "image"}
        value={url}
        onChange={setUrl}
      />
    </div>
  );
}
