import type { MDXComponents } from "mdx/types";
import AudioPlayer from "./AudioPlayer";

export const mdxComponents: MDXComponents = {
  AudioPlayer,
  img: (props) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} loading="lazy" className="rounded-xl" alt={props.alt ?? ""} />
  ),
  a: (props) => (
    <a {...props} target={props.href?.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" />
  ),
};
