"use client";

import { Music2, Check } from "lucide-react";

const SAMPLE_TRACKS = [
  {
    src: "/audio/veena-haratanaya-sree.mp3",
    label: "Veena (instrumental)",
    credit: "Veena Kinhal — Public Domain",
  },
  {
    src: "/audio/bansuri-folk-classical.mp3",
    label: "Bansuri flute",
    credit: "MayankSingh33 — CC BY-SA 4.0",
  },
];

export default function SampleAudioPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string) => void;
}) {
  return (
    <div className="mt-3">
      <p className="mb-2 text-xs font-medium text-black/50 dark:text-white/50">
        Or use a ready-made track — no upload needed
      </p>
      <div className="flex flex-col gap-2 sm:flex-row">
        {SAMPLE_TRACKS.map((track) => {
          const selected = value === track.src;
          return (
            <button
              key={track.src}
              type="button"
              onClick={() => onChange(track.src)}
              className={`flex flex-1 items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors ${
                selected
                  ? "border-amber-600/40 bg-amber-600/10"
                  : "border-black/10 hover:bg-black/[0.03] dark:border-white/10 dark:hover:bg-white/[0.05]"
              }`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${
                  selected
                    ? "bg-amber-600/20 text-amber-700 dark:bg-amber-400/20 dark:text-amber-400"
                    : "bg-black/5 text-black/50 dark:bg-white/10 dark:text-white/50"
                }`}
              >
                {selected ? <Check size={16} /> : <Music2 size={16} />}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{track.label}</p>
                <p className="truncate text-xs text-black/45 dark:text-white/45">{track.credit}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
