import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, Eye, Pencil, FileText } from "lucide-react";
import { auth } from "@/lib/auth";
import { getAllPostsForAdmin } from "@/lib/posts";
import DeletePostButton from "./DeletePostButton";

export default async function AdminPostsPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/login");

  const posts = await getAllPostsForAdmin();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-1.5 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-black"
        >
          <Plus size={16} />
          New post
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-2">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between gap-4 rounded-xl border border-black/10 bg-black/[0.015] px-4 py-3.5 transition-colors hover:bg-black/[0.03] dark:border-white/10 dark:bg-white/[0.02] dark:hover:bg-white/[0.05]"
          >
            <div className="min-w-0">
              <p className="flex items-center gap-2 truncate font-medium">
                {post.title}
                {!post.published && (
                  <span className="shrink-0 rounded-full bg-amber-600/10 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-400/10 dark:text-amber-400">
                    Draft
                  </span>
                )}
              </p>
              <p className="text-sm text-black/50 dark:text-white/50">
                {new Date(post.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-1 text-sm">
              <Link
                href={`/blog/${post.slug}`}
                title="View"
                className="rounded-md p-2 text-black/50 hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <Eye size={16} />
              </Link>
              <Link
                href={`/admin/posts/${post.id}/edit`}
                title="Edit"
                className="rounded-md p-2 text-black/50 hover:bg-black/5 hover:text-black dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white"
              >
                <Pencil size={16} />
              </Link>
              <DeletePostButton id={post.id} />
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-black/15 py-16 text-center dark:border-white/15">
            <FileText size={28} className="text-black/25 dark:text-white/25" />
            <p className="text-sm text-black/50 dark:text-white/50">No posts yet — write your first one.</p>
            <Link
              href="/admin/posts/new"
              className="mt-1 rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-black"
            >
              New post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
