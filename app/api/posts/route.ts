import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";
import { slugify } from "@/lib/slugify";
import { sanitizePostHtml } from "@/lib/sanitizeHtml";

const bodySchema = z.object({
  title: z.string().min(1).max(200),
  excerpt: z.string().max(500).optional().default(""),
  contentHtml: z.string().min(1),
  tags: z.array(z.string().min(1).max(40)).max(20).optional().default([]),
  coverImage: z.string().url().optional().nullable(),
  backgroundAudioUrl: z.string().url().optional().nullable(),
  published: z.boolean().optional().default(true),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const json = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid post data" }, { status: 400 });
  }

  const data = parsed.data;
  const cleanHtml = sanitizePostHtml(data.contentHtml);

  let slug = slugify(data.title) || "post";
  const [existing] = await db.select().from(posts).where(eq(posts.slug, slug));
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const [row] = await db
    .insert(posts)
    .values({
      slug,
      title: data.title,
      excerpt: data.excerpt,
      contentHtml: cleanHtml,
      tags: data.tags,
      coverImage: data.coverImage ?? null,
      backgroundAudioUrl: data.backgroundAudioUrl ?? null,
      published: data.published,
    })
    .returning();

  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath("/tags");
  revalidatePath(`/blog/${slug}`);

  return NextResponse.json({ post: row });
}
