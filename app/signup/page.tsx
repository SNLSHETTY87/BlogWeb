import Link from "next/link";
import SignupForm from "./SignupForm";

export default function SignupPage() {
  return (
    <div className="mx-auto flex max-w-sm flex-col gap-4 px-4 py-24">
      <h1 className="text-2xl font-semibold">Create an account</h1>
      <SignupForm />
      <p className="text-sm text-black/60 dark:text-white/60">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
