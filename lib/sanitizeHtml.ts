import sanitizeHtml from "sanitize-html";

export function sanitizePostHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "audio", "h1", "h2"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt"],
      audio: ["src", "controls"],
      a: ["href", "target", "rel"],
    },
  });
}
