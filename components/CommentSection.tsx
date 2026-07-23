"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type Comment = {
  id: string;
  body: string;
  createdAt: string;
  userName: string | null;
  userImage: string | null;
};

export default function CommentSection({ postSlug }: { postSlug: string }) {
  const { data: session } = useSession();
  const isLoggedIn = Boolean(session?.user);
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/comments?postSlug=${encodeURIComponent(postSlug)}`)
      .then((res) => res.json())
      .then((data) => setComments(data.comments ?? []));
  }, [postSlug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postSlug, body: text }),
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setComments((prev) => [
        { ...data.comment, userName: "You", userImage: null },
        ...prev,
      ]);
      setText("");
    }
  }

  return (
    <section className="mt-16">
      <h2 className="text-lg font-semibold">Comments ({comments.length})</h2>

      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-transparent"
          />
          <button
            disabled={loading}
            className="self-start rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {loading ? "Posting..." : "Post comment"}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm text-black/60 dark:text-white/60">
          <a href="/login" className="underline">
            Sign in
          </a>{" "}
          to leave a comment.
        </p>
      )}

      <ul className="mt-6 flex flex-col gap-4">
        {comments.map((comment) => (
          <li key={comment.id} className="border-b border-black/10 pb-4 dark:border-white/10">
            <p className="text-sm font-medium">{comment.userName ?? "Anonymous"}</p>
            <p className="mt-1 text-sm text-black/80 dark:text-white/80">{comment.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
