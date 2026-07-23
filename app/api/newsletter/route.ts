import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db/client";
import { subscribers } from "@/lib/db/schema";

const bodySchema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  await db
    .insert(subscribers)
    .values({ email: parsed.data.email })
    .onConflictDoNothing();

  return NextResponse.json({ ok: true });
}
