import type { Metadata } from "next";
import css from "./page.module.css";
import { absoluteUrl, OG_IMAGE } from "@/lib/seo";
import NoteForm from "@/components/NoteForm/NoteForm";

export const metadata: Metadata = {
  title: "Create note",
  description: "Create new note in NoteHub",
  openGraph: {
    title: "Create note",
    description: "Create new note in NoteHub",
    url: absoluteUrl("/notes/action/create"),
    images: [{ url: OG_IMAGE }],
  },
};

export default function CreateNotePage() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
