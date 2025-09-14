// lib/seo.ts
export const SITE_URL = (() => {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit;

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
})();

export const OG_IMAGE =
  "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg";

export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();
