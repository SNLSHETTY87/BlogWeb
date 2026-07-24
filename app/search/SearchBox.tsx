"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon } from "lucide-react";

type Result = { slug: string; title: string; excerpt: string };

export default function SearchBox() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect -- flips on before the debounced fetch starts, not a render loop
    setLoading(true);
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`);
      const data = await res.json();
      setResults(data.results ?? []);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const trimmedQuery = query.trim();

  return (
    <div>
      <div className="relative">
        <SearchIcon
          size={16}
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-black/35 dark:text-white/35"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts…"
          autoFocus
          className="w-full rounded-lg border border-black/10 bg-transparent py-2.5 pr-3 pl-10 text-sm outline-none focus:border-amber-600/50 dark:border-white/10"
        />
      </div>

      {trimmedQuery && (
        <>
          <ul className="mt-8 flex flex-col gap-6">
            {results.map((result) => (
              <li key={result.slug}>
                <Link
                  href={`/blog/${result.slug}`}
                  className="font-serif text-lg font-medium hover:text-amber-700 dark:hover:text-amber-400"
                >
                  {result.title}
                </Link>
                <p className="mt-1 text-sm text-black/60 dark:text-white/60">{result.excerpt}</p>
              </li>
            ))}
          </ul>

          {loading && <p className="mt-6 text-sm text-black/45 dark:text-white/45">Searching…</p>}
          {!loading && results.length === 0 && (
            <p className="mt-6 text-sm text-black/45 dark:text-white/45">
              No posts found for &ldquo;{trimmedQuery}&rdquo;.
            </p>
          )}
        </>
      )}
    </div>
  );
}
