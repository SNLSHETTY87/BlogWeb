import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const revalidate = 60;

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight">Simply Human Blog</h1>
      <p className="mt-2 text-black/60 dark:text-white/60">
        Human psychology, explained — with science.
      </p>

      <ul className="mt-12 flex flex-col gap-10">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group">
              <h2 className="text-xl font-semibold group-hover:underline">{post.title}</h2>
            </Link>
            <p className="mt-1 text-sm text-black/50 dark:text-white/50">
              {new Date(post.date).toLocaleDateString()} · {post.readingTime}
            </p>
            <p className="mt-2 text-black/80 dark:text-white/80">{post.excerpt}</p>
            <div className="mt-3 flex gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag}`}
                  className="rounded-full border border-black/10 px-2 py-0.5 text-xs hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
