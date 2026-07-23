import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { auth } from "@/lib/auth";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const blob = await put(file.name, file, {
    access: "public",
    addRandomSuffix: true,
  });

  return NextResponse.json({ url: blob.url });
}
