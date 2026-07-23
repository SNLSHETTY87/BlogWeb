import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import UploadForm from "./UploadForm";

export default async function AdminUploadPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Upload media</h1>
      <p className="mt-2 text-sm text-black/60 dark:text-white/60">
        Upload an image or audio file to get a shareable URL. Usually you won&apos;t need this —
        the <a href="/admin/posts/new" className="underline">post editor</a> lets you paste
        images and insert audio directly. This page is just a standalone uploader if you need a
        raw file URL for something else.
      </p>
      <UploadForm />
    </div>
  );
}
