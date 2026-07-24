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

function PostMeta({ post, tone }: { post: { date: string; readingTime: string }; tone: "light" | "dark" }) {
  return (
    <p className={tone === "light" ? "text-sm text-white/80" : "text-sm text-black/50 dark:text-white/50"}>
      {new Date(post.date).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}{" "}
      · {post.readingTime}
    </p>
  );
}

function PostTags({ tags, tone }: { tags: string[]; tone: "light" | "dark" }) {
  if (tags.length === 0) return null;
  return (
    <div className="mb-4 flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <Link
          key={tag}
          href={`/tags/${tag}`}
          className={
            tone === "light"
              ? "rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/25"
              : "rounded-full bg-amber-600/10 px-2.5 py-0.5 text-xs font-medium text-amber-800 hover:bg-amber-600/20 dark:bg-amber-400/10 dark:text-amber-300 dark:hover:bg-amber-400/20"
          }
        >
          {tag}
        </Link>
      ))}
    </div>
  );
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
    <article>
      {post.cover ? (
        <header
          className="relative flex min-h-[60vh] items-end bg-cover bg-center px-4 py-12 sm:min-h-[70vh]"
          style={{ backgroundImage: `url(${post.cover})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
          <div className="relative mx-auto w-full max-w-3xl">
            <PostTags tags={post.tags} tone="light" />
            <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
              {post.title}
            </h1>
            <div className="mt-3">
              <PostMeta post={post} tone="light" />
            </div>
          </div>
        </header>
      ) : (
        <header className="mx-auto max-w-3xl px-4 pt-16">
          <PostTags tags={post.tags} tone="dark" />
          <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            {post.title}
          </h1>
          <div className="mt-3">
            <PostMeta post={post} tone="dark" />
          </div>
        </header>
      )}

      <div className="mx-auto max-w-3xl px-4 pb-16">
        <div
          className="prose prose-neutral prose-lg mt-10 max-w-none font-serif dark:prose-invert prose-headings:font-serif prose-a:text-amber-700 dark:prose-a:text-amber-400"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="mt-10 flex items-center justify-between">
          <LikeButton postSlug={post.slug} />
        </div>

        <CommentSection postSlug={post.slug} />
      </div>

      {post.backgroundAudioUrl && <BackgroundAudioPlayer src={post.backgroundAudioUrl} />}
    </article>
  );
}
