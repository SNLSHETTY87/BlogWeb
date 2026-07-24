import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const revalidate = 60;

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-4xl font-semibold tracking-tight md:text-5xl">
        Human psychology, explained.
      </h1>
      <p className="mt-3 max-w-lg text-black/60 dark:text-white/60">
        Science-backed explainers on why people think, feel, and behave the way they do.
      </p>

      <ul className="mt-14 flex flex-col gap-3">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group flex items-start gap-5 rounded-xl p-3 -mx-3 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04]"
            >
              {post.cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={post.cover}
                  alt=""
                  className="h-20 w-20 shrink-0 rounded-lg object-cover md:h-24 md:w-24"
                />
              )}
              <div className="min-w-0">
                <h2 className="font-serif text-xl font-semibold leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 md:text-2xl">
                  {post.title}
                </h2>
                <p className="mt-1 text-sm text-black/45 dark:text-white/45">
                  {new Date(post.date).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}{" "}
                  · {post.readingTime}
                </p>
                <p className="mt-2 text-black/70 dark:text-white/70">{post.excerpt}</p>
                {post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-amber-600/10 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-400/10 dark:text-amber-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </li>
        ))}

        {posts.length === 0 && (
          <p className="py-16 text-center text-black/40 dark:text-white/40">
            No posts published yet — check back soon.
          </p>
        )}
      </ul>
    </div>
  );
}
