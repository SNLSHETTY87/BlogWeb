import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag } from "@/lib/posts";

export const revalidate = 60;

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((tag) => ({ tag }));
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = await getPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Tag</p>
      <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight">{tag}</h1>
      <ul className="mt-10 flex flex-col gap-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="font-serif text-lg font-medium hover:text-amber-700 dark:hover:text-amber-400"
            >
              {post.title}
            </Link>
            <p className="text-sm text-black/50 dark:text-white/50">
              {new Date(post.date).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
