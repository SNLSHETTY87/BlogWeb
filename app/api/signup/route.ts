import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";

const bodySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email(),
  password: z.string().min(8).max(72),
});

export async function POST(request: Request) {
  const json = await request.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please enter a valid email and an 8+ character password." }, { status: 400 });
  }

  const { name, email, password } = parsed.data;

  const [existing] = await db.select().from(users).where(eq(users.email, email));
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(users).values({ name, email, passwordHash });

  return NextResponse.json({ ok: true });
}
