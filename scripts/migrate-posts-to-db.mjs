import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { pgTable, text, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull().default(""),
  contentHtml: text("content_html").notNull(),
  tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
  coverImage: text("cover_image"),
  backgroundAudioUrl: text("background_audio_url"),
  published: boolean("published").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");
const db = drizzle(neon(connectionString));

const seedPosts = [
  {
    slug: "hello-world",
    title: "Hello World: Welcome to the Blog",
    excerpt:
      "The first post on this brand new blog, built with Next.js, a browser editor, and a few modern touches.",
    tags: ["meta", "announcement"],
    createdAt: new Date("2026-07-01"),
    contentHtml: `
<p>Welcome! This is the first post on this blog. It's built with <strong>Next.js</strong>,
written directly in the browser with a simple editor, and deployed on <strong>Vercel</strong>.</p>
<h2>What this blog can do</h2>
<ul>
<li>Rich posts written right in the browser — no files, no git</li>
<li>Paste an image straight into the editor and it uploads automatically</li>
<li>Embedded audio clips, like the one below</li>
<li>Optional background music while you read a post</li>
<li>Full-text search</li>
<li>Comments and likes for logged-in readers</li>
<li>A newsletter you can subscribe to</li>
</ul>
<audio controls src="/audio/sample-clip.mp3"></audio>
<h2>A code block, just to show off syntax highlighting</h2>
<pre><code>function greet(name) {
  return \`Hello, \${name}!\`;
}</code></pre>
<p>More posts coming soon.</p>
`.trim(),
  },
  {
    slug: "writing-with-mdx",
    title: "Writing Posts on This Blog",
    excerpt: "How posts are written now: a browser editor with paste-to-upload images and audio.",
    tags: ["guide", "meta"],
    createdAt: new Date("2026-07-10"),
    contentHtml: `
<p>Posts on this blog are written straight in the browser at
<code>/admin/posts/new</code> — no files, no git, no markdown syntax to remember.</p>
<h2>Adding images</h2>
<p>Just paste an image (Ctrl+V) anywhere in the editor, or drag one in. It uploads
automatically and appears inline, the same way it would in Word or Confluence.</p>
<h2>Adding audio or music</h2>
<p>Use the "Insert audio" button in the toolbar to embed a playable clip anywhere in
a post. There's also a separate "Background audio" field for a track that can quietly
play in the background while someone reads — readers can turn it off any time with the
floating toggle in the corner.</p>
<p>That's it — write, paste, publish.</p>
`.trim(),
  },
];

for (const post of seedPosts) {
  await db
    .insert(posts)
    .values(post)
    .onConflictDoUpdate({
      target: posts.slug,
      set: {
        title: post.title,
        excerpt: post.excerpt,
        tags: post.tags,
        contentHtml: post.contentHtml,
        updatedAt: new Date(),
      },
    });
  console.log(`upserted: ${post.slug}`);
}

console.log("done");
