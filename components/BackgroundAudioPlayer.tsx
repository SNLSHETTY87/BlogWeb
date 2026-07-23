"use client";

import { useRef, useState } from "react";

export default function BackgroundAudioPlayer({ src }: { src: string }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <audio ref={audioRef} src={src} loop preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? "Turn off background music" : "Play background music"}
        aria-pressed={playing}
        className="flex items-center gap-2 rounded-full border border-black/10 bg-white/90 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur hover:bg-white dark:border-white/10 dark:bg-black/90 dark:hover:bg-black"
      >
        <span>{playing ? "🔊" : "🔈"}</span>
        <span>{playing ? "Music on" : "Play music"}</span>
      </button>
    </div>
  );
}
