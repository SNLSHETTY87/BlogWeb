import { NextResponse } from "next/server";
import { and, eq, or, ilike, desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const pattern = `%${q}%`;
  const rows = await db
    .select({
      slug: posts.slug,
      title: posts.title,
      excerpt: posts.excerpt,
    })
    .from(posts)
    .where(
      and(
        eq(posts.published, true),
        or(ilike(posts.title, pattern), ilike(posts.excerpt, pattern), ilike(posts.contentHtml, pattern))
      )
    )
    .orderBy(desc(posts.createdAt))
    .limit(20);

  return NextResponse.json({ results: rows });
}
