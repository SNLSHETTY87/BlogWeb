import { z } from "zod";

// Accepts either a full http(s) URL (Vercel Blob uploads) or a site-relative
// path (bundled sample audio tracks served from /public), e.g. "/audio/track.mp3".
// Rejects "//host/..." and "/\host/..." — browsers treat both as protocol-relative
// URLs pointing at an external host, not a same-origin path.
export const urlOrPath = z.string().refine(
  (value) => {
    if (value.startsWith("/") && !value.startsWith("//") && !value.startsWith("/\\")) {
      return true;
    }
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  },
  { message: "Must be an http(s) URL or a site-relative path" }
);
