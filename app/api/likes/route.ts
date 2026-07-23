import { NextResponse } from "next/server";
import { z } from "zod";
import { and, eq, count } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db/client";
import { likes } from "@/lib/db/schema";

const bodySchema = z.object({ postSlug: z.string().min(1) });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postSlug = searchParams.get("postSlug");
  if (!postSlug) {
    return NextResponse.json({ error: "postSlug is required" }, { status: 400 });
  }

  const [{ value }] = await db
    .select({ value: count() })
    .from(likes)
    .where(eq(likes.postSlug, postSlug));

  const session = await auth();
  let likedByMe = false;
  if (session?.user?.id) {
    const existing = await db
      .select()
      .from(likes)
      .where(and(eq(likes.postSlug, postSlug), eq(likes.userId, session.user.id)));
    likedByMe = existing.length > 0;
  }

  return NextResponse.json({ count: value, likedByMe });
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const json = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const existing = await db
    .select()
    .from(likes)
    .where(and(eq(likes.postSlug, parsed.data.postSlug), eq(likes.userId, session.user.id)));

  if (existing.length > 0) {
    await db.delete(likes).where(eq(likes.id, existing[0].id));
    return NextResponse.json({ liked: false });
  }

  await db.insert(likes).values({ postSlug: parsed.data.postSlug, userId: session.user.id });
  return NextResponse.json({ liked: true });
}
