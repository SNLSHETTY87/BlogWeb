import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import PostForm from "../PostForm";

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/admin/posts"
        className="flex w-fit items-center gap-1.5 text-sm text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
      >
        <ArrowLeft size={14} />
        Posts
      </Link>
      <div className="mt-6">
        <PostForm />
      </div>
    </div>
  );
}
