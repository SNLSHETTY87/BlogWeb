import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { MDXContent } from "@/lib/mdx";
import CommentSection from "@/components/CommentSection";
import LikeButton from "@/components/LikeButton";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
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
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
        <p className="mt-2 text-sm text-black/50 dark:text-white/50">
          {post.date} · {post.readingTime}
        </p>
      </header>

      <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        <MDXContent source={post.content} />
      </div>

      <div className="mt-10 flex items-center justify-between border-t border-black/10 pt-6 dark:border-white/10">
        <LikeButton postSlug={post.slug} />
      </div>

      <CommentSection postSlug={post.slug} />
    </article>
  );
}
