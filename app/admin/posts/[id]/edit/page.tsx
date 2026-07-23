import { notFound, redirect } from "next/navigation";
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
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Edit post</h1>
      <div className="mt-8">
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
