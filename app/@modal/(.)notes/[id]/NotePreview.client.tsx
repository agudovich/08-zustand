"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import Modal from "@/components/Modal/Modal";
import css from "./page.module.css";

export default function NotePreviewClient({ id }: { id: string }) {
  const router = useRouter();

  const enabled = id !== "filter";
  const { data, isPending, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled,
    refetchOnMount: false,
  });

  // если не должны показывать — вообще ничего
  if (!enabled) return null;

  return (
    <Modal isOpen onClose={() => router.back()}>
      {isPending && <p>Loading, please wait...</p>}
      {error && <p>Something went wrong.</p>}
      {data && (
        <article className={css.card}>
          <h1 className={css.title}>{data.title}</h1>
          <p className={css.content}>{data.content}</p>
          <time className={css.date}>
            {new Date(data.updatedAt ?? data.createdAt).toLocaleString()}
          </time>
        </article>
      )}
    </Modal>
  );
}
