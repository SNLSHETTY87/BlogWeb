import Link from "next/link";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col px-4 py-20">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">Create an account</h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Sign in to comment and like posts.
      </p>

      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-black/10 bg-black/[0.015] p-6 dark:border-white/10 dark:bg-white/[0.02]">
        <SignupForm />
        <p className="text-center text-sm text-black/60 dark:text-white/60">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-amber-700 hover:underline dark:text-amber-400">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
