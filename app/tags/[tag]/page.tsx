import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllTags, getPostsByTag } from "@/lib/posts";

export function generateStaticParams() {
  return getAllTags().map((tag) => ({ tag }));
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Tag: {tag}</h1>
      <ul className="mt-8 flex flex-col gap-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="text-lg font-medium hover:underline">
              {post.title}
            </Link>
            <p className="text-sm text-black/50 dark:text-white/50">{post.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
