import { NextResponse } from "next/server";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { comments, users } from "@/lib/db/schema";

const bodySchema = z.object({
  postSlug: z.string().min(1),
  body: z.string().min(1).max(2000),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postSlug = searchParams.get("postSlug");
  if (!postSlug) {
    return NextResponse.json({ error: "postSlug is required" }, { status: 400 });
  }

  const rows = await db
    .select({
      id: comments.id,
      body: comments.body,
      createdAt: comments.createdAt,
      userName: users.name,
      userImage: users.image,
    })
    .from(comments)
    .innerJoin(users, eq(comments.userId, users.id))
    .where(eq(comments.postSlug, postSlug))
    .orderBy(desc(comments.createdAt));

  return NextResponse.json({ comments: rows });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid comment" }, { status: 400 });
  }

  const [row] = await db
    .insert(comments)
    .values({
      postSlug: parsed.data.postSlug,
      body: parsed.data.body,
      userId: session.user.id,
    })
    .returning();

  return NextResponse.json({ comment: row });
}
