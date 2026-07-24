import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "80px",
          backgroundImage: post?.cover
            ? `linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.2)), url(${post.cover})`
            : "linear-gradient(135deg, #14110d, #221e19)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.7 }}>Simply Human</div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 24, lineHeight: 1.2 }}>
          {post?.title ?? "Simply Human"}
        </div>
      </div>
    ),
    { ...size }
  );
}
