import { signIn } from "@/lib/auth";

export default function LoginPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 px-4 py-24">
      <h1 className="text-2xl font-semibold">Sign in</h1>
      <p className="text-sm text-black/60 dark:text-white/60">
        Sign in to comment and like posts.
      </p>

      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <button className="w-full rounded-lg border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10">
          Continue with GitHub
        </button>
      </form>

      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button className="w-full rounded-lg border border-black/10 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10">
          Continue with Google
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
          className="rounded-lg border border-black/10 px-3 py-2 text-sm dark:border-white/10 dark:bg-transparent"
        />
        <button className="w-full rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-black">
          Continue with email
        </button>
      </form>
    </div>
  );
}
