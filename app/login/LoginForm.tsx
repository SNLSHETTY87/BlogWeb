"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const result = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Incorrect email or password.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        type="email"
        name="email"
        required
        placeholder="you@example.com"
        className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-amber-600/50 dark:border-white/10"
      />
      <input
        type="password"
        name="password"
        required
        placeholder="Password"
        className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-amber-600/50 dark:border-white/10"
      />
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <button
        disabled={loading}
        className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
      >
        {loading ? "Signing in..." : "Sign in with password"}
      </button>
    </form>
  );
}
