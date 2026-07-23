"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email");
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <h2 className="text-sm font-semibold">Subscribe to the newsletter</h2>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        Get new posts in your inbox. No spam.
      </p>
      <form onSubmit={handleSubmit} className="mt-3 flex max-w-sm gap-2">
        <input
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-transparent"
        />
        <button
          disabled={status === "loading"}
          className="shrink-0 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
      </form>
      {status === "done" && (
        <p className="mt-2 text-sm text-green-600 dark:text-green-400">You&apos;re subscribed!</p>
      )}
      {status === "error" && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}
