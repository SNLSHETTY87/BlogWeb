"use client";

import { useEffect, useState } from "react";

export default function LikeButton({ postSlug }: { postSlug: string }) {
  const [count, setCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    fetch(`/api/likes?postSlug=${encodeURIComponent(postSlug)}`)
      .then((res) => res.json())
      .then((data) => {
        setCount(data.count ?? 0);
        setLiked(data.likedByMe ?? false);
      });
  }, [postSlug]);

  async function toggle() {
    const res = await fetch("/api/likes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postSlug }),
    });
    if (res.status === 401) {
      window.location.href = "/login";
      return;
    }
    const data = await res.json();
    setLiked(data.liked);
    setCount((c) => (data.liked ? c + 1 : c - 1));
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-1.5 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
    >
      <span>{liked ? "❤️" : "🤍"}</span>
      <span>{count}</span>
    </button>
  );
}
