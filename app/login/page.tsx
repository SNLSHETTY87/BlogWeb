import Link from "next/link";
import { signIn } from "@/lib/auth";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col px-4 py-20">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Sign in to comment and like posts.
      </p>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-black/10 bg-black/[0.015] p-6 dark:border-white/10 dark:bg-white/[0.02]">
        <LoginForm />

        <p className="text-center text-sm text-black/60 dark:text-white/60">
          No account yet?{" "}
          <Link href="/signup" className="font-medium text-amber-700 hover:underline dark:text-amber-400">
            Sign up
          </Link>
        </p>

        <div className="flex items-center gap-3 text-xs text-black/40 dark:text-white/40">
          <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
          or continue with
          <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
        </div>

        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <button className="w-full rounded-lg border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10">
            GitHub
          </button>
        </form>

        <form
          action={async () => {
            "use server";
            await signIn("google");
          }}
        >
          <button className="w-full rounded-lg border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10">
            Google
          </button>
        </form>

        <form
          action={async (formData: FormData) => {
            "use server";
            await signIn("resend", { email: formData.get("email") });
          }}
          className="flex flex-col gap-2"
        >
          <input
            type="email"
            name="email"
            required
            placeholder="you@example.com"
            className="rounded-lg border border-black/10 bg-transparent px-3 py-2 text-sm outline-none focus:border-amber-600/50 dark:border-white/10"
          />
          <button className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-black">
            Email me a sign-in link
          </button>
        </form>
      </div>
    </div>
  );
}
