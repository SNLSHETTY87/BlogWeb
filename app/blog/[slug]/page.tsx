import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";
import BackgroundAudioPlayer from "@/components/BackgroundAudioPlayer";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || !post.published) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        <p className="mt-2 text-sm text-black/50 dark:text-white/50">
          {new Date(post.date).toLocaleDateString()} · {post.readingTime}
        </p>
      </header>

      <div
        className="prose prose-neutral mt-10 max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-10 flex items-center justify-between border-t border-black/10 pt-6 dark:border-white/10">
        <LikeButton postSlug={post.slug} />
      </div>

      <CommentSection postSlug={post.slug} />

      {post.backgroundAudioUrl && <BackgroundAudioPlayer src={post.backgroundAudioUrl} />}
    </article>
  );
}
