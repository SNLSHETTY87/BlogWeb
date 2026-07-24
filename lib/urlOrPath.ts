import { z } from "zod";

// Accepts either a full URL (Vercel Blob uploads) or a site-relative path
// (bundled sample audio tracks served from /public), e.g. "/audio/track.mp3".
export const urlOrPath = z
  .string()
  .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), {
    message: "Must be a URL or a site-relative path",
  });
