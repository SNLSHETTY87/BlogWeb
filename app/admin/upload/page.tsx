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
        Upload an image or audio file, then copy its URL into a post&apos;s MDX file — as{" "}
        <code>{`![alt](url)`}</code> for images, or{" "}
        <code>{`<AudioPlayer src="url" title="..." />`}</code> for audio.
      </p>
      <UploadForm />
    </div>
  );
}
