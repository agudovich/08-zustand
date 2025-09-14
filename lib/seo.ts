// lib/seo.ts
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const OG_IMAGE =
  "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();
