"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-30 border-b border-black/10 bg-[var(--background)]/85 backdrop-blur dark:border-white/10">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight">
          Simply Human
        </Link>
        <nav className="flex items-center gap-5 text-sm">
          <Link
            href="/search"
            className="text-black/60 transition-colors hover:text-amber-700 dark:text-white/60 dark:hover:text-amber-400"
          >
            Search
          </Link>
          <Link
            href="/tags"
            className="text-black/60 transition-colors hover:text-amber-700 dark:text-white/60 dark:hover:text-amber-400"
          >
            Tags
          </Link>
          {session?.user?.isAdmin && (
            <Link
              href="/admin/posts"
              className="text-black/60 transition-colors hover:text-amber-700 dark:text-white/60 dark:hover:text-amber-400"
            >
              Write
            </Link>
          )}
          <ThemeToggle />
          {session?.user ? (
            <button
              onClick={() => signOut()}
              className="text-black/60 transition-colors hover:text-amber-700 dark:text-white/60 dark:hover:text-amber-400"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-black px-3.5 py-1.5 text-white hover:opacity-90 dark:bg-white dark:text-black"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
