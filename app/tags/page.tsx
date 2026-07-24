import Link from "next/link";
import { getAllTags } from "@/lib/posts";

export const revalidate = 60;

export default async function TagsIndexPage() {
  const tags = await getAllTags();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">Tags</h1>
      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className="rounded-full bg-amber-600/10 px-3.5 py-1.5 text-sm font-medium text-amber-800 transition-colors hover:bg-amber-600/20 dark:bg-amber-400/10 dark:text-amber-300 dark:hover:bg-amber-400/20"
          >
            {tag}
          </Link>
        ))}
        {tags.length === 0 && (
          <p className="text-sm text-black/45 dark:text-white/45">No tags yet.</p>
        )}
      </div>
    </div>
  );
}
