import Link from "next/link";
import { redirect } from "next/navigation";
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
        <h1 className="text-2xl font-semibold">Posts</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 dark:bg-white dark:text-black"
        >
          New post
        </Link>
      </div>

      <ul className="mt-8 flex flex-col divide-y divide-black/10 dark:divide-white/10">
        {posts.map((post) => (
          <li key={post.id} className="flex items-center justify-between gap-4 py-4">
            <div>
              <p className="font-medium">
                {post.title}
                {!post.published && (
                  <span className="ml-2 rounded-full bg-black/10 px-2 py-0.5 text-xs dark:bg-white/10">
                    Draft
                  </span>
                )}
              </p>
              <p className="text-sm text-black/50 dark:text-white/50">
                {new Date(post.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-3 text-sm">
              <Link href={`/blog/${post.slug}`} className="hover:underline">
                View
              </Link>
              <Link href={`/admin/posts/${post.id}/edit`} className="hover:underline">
                Edit
              </Link>
              <DeletePostButton id={post.id} />
            </div>
          </li>
        ))}
        {posts.length === 0 && (
          <p className="py-8 text-sm text-black/50 dark:text-white/50">No posts yet.</p>
        )}
      </ul>
    </div>
  );
}
