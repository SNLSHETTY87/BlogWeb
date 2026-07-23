"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-black/10 dark:border-white/10">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Simply Human Blog
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/search" className="hover:underline">
            Search
          </Link>
          <Link href="/tags" className="hover:underline">
            Tags
          </Link>
          <ThemeToggle />
          {session?.user ? (
            <button onClick={() => signOut()} className="hover:underline">
              Sign out
            </button>
          ) : (
            <Link href="/login" className="hover:underline">
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
