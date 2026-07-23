import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import PostForm from "../PostForm";

export default async function NewPostPage() {
  const session = await auth();
  if (!session?.user?.isAdmin) redirect("/login");

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-2xl font-semibold">New post</h1>
      <div className="mt-8">
        <PostForm />
      </div>
    </div>
  );
}
