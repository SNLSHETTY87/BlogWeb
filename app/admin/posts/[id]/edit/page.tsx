import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/lib/auth";
import { getPostById } from "@/lib/posts";
import PostForm from "../../PostForm";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/login");

  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

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
        <PostForm
          initial={{
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            contentHtml: post.content,
            tags: post.tags,
            coverImage: post.cover,
            backgroundAudioUrl: post.backgroundAudioUrl,
            published: post.published,
          }}
        />
      </div>
    </div>
  );
}
