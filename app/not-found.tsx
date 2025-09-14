// app/not-found.tsx
import type { Metadata } from "next";
import css from "./not-found.module.css";
import { absoluteUrl, OG_IMAGE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Page not found",
  description: "Oops! Page not found.",
  openGraph: {
    title: "Page not found",
    description: "Oops! Page not found.",
    url: absoluteUrl("/not-found"),
    images: [{ url: OG_IMAGE }],
  },
};

export default function NotFound() {
  return (
    <main className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>
        Sorry, the page you are looking for does not exist.
      </p>
    </main>
  );
}
