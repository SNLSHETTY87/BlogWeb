"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

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
      <h2 className="font-serif text-lg font-semibold">Get new posts by email</h2>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        One email per post. No spam, unsubscribe any time.
      </p>

      {status === "done" ? (
        <p className="mt-4 flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
          <Check size={16} />
          You&apos;re subscribed!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex max-w-sm gap-2">
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-amber-600/50 dark:border-white/10"
          />
          <button
            disabled={status === "loading"}
            className="flex shrink-0 items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
          >
            {status === "loading" ? "…" : "Subscribe"}
            {status !== "loading" && <ArrowRight size={14} />}
          </button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          Something went wrong. Try again.
        </p>
      )}
    </div>
  );
}
