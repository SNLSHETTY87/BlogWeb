import { desc, eq, sql } from "drizzle-orm";
import readingTime from "reading-time";
import { db } from "@/lib/db/client";
import { posts } from "@/lib/db/schema";

export type PostMeta = {
  id: string;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  cover: string | null;
  readingTime: string;
  published: boolean;
};

export type Post = PostMeta & {
  content: string;
  backgroundAudioUrl: string | null;
};

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ");
}

function toMeta(row: typeof posts.$inferSelect): PostMeta {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.createdAt.toISOString(),
    excerpt: row.excerpt,
    tags: row.tags,
    cover: row.coverImage,
    readingTime: readingTime(stripHtml(row.contentHtml)).text,
    published: row.published,
  };
}

export async function getAllPosts(): Promise<PostMeta[]> {
  const rows = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt));
  return rows.map(toMeta);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const [row] = await db.select().from(posts).where(eq(posts.slug, slug));
  if (!row) return null;
  return { ...toMeta(row), content: row.contentHtml, backgroundAudioUrl: row.backgroundAudioUrl };
}

export async function getAllTags(): Promise<string[]> {
  const rows = await getAllPosts();
  const tags = new Set<string>();
  for (const post of rows) {
    for (const tag of post.tags) tags.add(tag);
  }
  return Array.from(tags).sort();
}

export async function getPostsByTag(tag: string): Promise<PostMeta[]> {
  const rows = await db
    .select()
    .from(posts)
    .where(sql`${posts.published} = true and ${tag} = any(${posts.tags})`)
    .orderBy(desc(posts.createdAt));
  return rows.map(toMeta);
}

// --- Admin-only helpers (include unpublished posts) ---

export async function getAllPostsForAdmin(): Promise<PostMeta[]> {
  const rows = await db.select().from(posts).orderBy(desc(posts.createdAt));
  return rows.map(toMeta);
}

export async function getPostById(id: string): Promise<Post | null> {
  const [row] = await db.select().from(posts).where(eq(posts.id, id));
  if (!row) return null;
  return { ...toMeta(row), content: row.contentHtml, backgroundAudioUrl: row.backgroundAudioUrl };
}
