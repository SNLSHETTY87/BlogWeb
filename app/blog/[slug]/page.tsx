import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
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
        {post.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className="rounded-full bg-amber-600/10 px-2.5 py-0.5 text-xs font-medium text-amber-800 hover:bg-amber-600/20 dark:bg-amber-400/10 dark:text-amber-300 dark:hover:bg-amber-400/20"
              >
                {tag}
              </Link>
            ))}
          </div>
        )}
        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-black/50 dark:text-white/50">
          {new Date(post.date).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          · {post.readingTime}
        </p>
      </header>

      {post.cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.cover}
          alt=""
          className="mt-8 aspect-video w-full rounded-2xl object-cover"
        />
      )}

      <div
        className="prose prose-neutral prose-lg mt-10 max-w-none font-serif dark:prose-invert prose-headings:font-serif prose-a:text-amber-700 dark:prose-a:text-amber-400"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-10 flex items-center justify-between">
        <LikeButton postSlug={post.slug} />
      </div>

      <CommentSection postSlug={post.slug} />

      {post.backgroundAudioUrl && <BackgroundAudioPlayer src={post.backgroundAudioUrl} />}
    </article>
  );
}
