import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import { mdxComponents } from "@/components/MDXComponents";

const rehypePrettyCodeOptions = {
  theme: { dark: "github-dark", light: "github-light" },
};

export function MDXContent({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
        },
      }}
    />
  );
}
