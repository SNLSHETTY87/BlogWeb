import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

export type PostFrontmatter = {
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  cover?: string;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: string;
};

export type Post = PostMeta & {
  content: string;
};

function slugFromFilename(filename: string) {
  return filename.replace(/\.mdx?$/, "");
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx") || file.endsWith(".md"))
    .map(slugFromFilename);
}

export function getPostBySlug(slug: string): Post | null {
  const fullPathMdx = path.join(POSTS_DIR, `${slug}.mdx`);
  const fullPathMd = path.join(POSTS_DIR, `${slug}.md`);
  const fullPath = fs.existsSync(fullPathMdx) ? fullPathMdx : fullPathMd;
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);

  return {
    slug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt ?? "",
    tags: data.tags ?? [],
    cover: data.cover,
    readingTime: readingTime(content).text,
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  return getAllSlugs()
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructuring to drop `content` from the meta-only list
    .map(({ content, ...meta }) => meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) tags.add(tag);
  }
  return Array.from(tags).sort();
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}
