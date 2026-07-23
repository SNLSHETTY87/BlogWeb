"use client";

import { useState } from "react";
import Link from "next/link";

type Result = { slug: string; title: string; excerpt: string };

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.results ?? []);
    setSearched(true);
    setLoading(false);
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts…"
          className="w-full rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-transparent"
        />
        <button
          disabled={loading}
          className="shrink-0 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {loading ? "…" : "Search"}
        </button>
      </form>

      <ul className="mt-6 flex flex-col gap-4">
        {results.map((result) => (
          <li key={result.slug}>
            <Link href={`/blog/${result.slug}`} className="text-lg font-medium hover:underline">
              {result.title}
            </Link>
            <p className="text-sm text-black/60 dark:text-white/60">{result.excerpt}</p>
          </li>
        ))}
      </ul>

      {searched && results.length === 0 && (
        <p className="mt-6 text-sm text-black/50 dark:text-white/50">No posts found.</p>
      )}
    </div>
  );
}
