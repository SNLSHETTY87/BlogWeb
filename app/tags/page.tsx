import Link from "next/link";
import { getAllTags } from "@/lib/posts";

export const revalidate = 60;

export default async function TagsIndexPage() {
  const tags = await getAllTags();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Tags</h1>
      <div className="mt-6 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className="rounded-full border border-black/10 px-3 py-1 text-sm hover:bg-black/5 dark:border-white/10 dark:hover:bg-white/10"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
}
