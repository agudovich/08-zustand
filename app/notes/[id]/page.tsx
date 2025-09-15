// app/notes/[id]/page.tsx
import type { Metadata } from "next";
import { absoluteUrl, OG_IMAGE } from "@/lib/seo";

import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import NoteDetailsClient from "./NoteDetails.client";
import { fetchNoteById } from "@/lib/api";

export async function generateMetadata(
  params: Promise<{ id: string }>
): Promise<Metadata> {
  const { id } = await params;

  try {
    const note = await fetchNoteById(id);
    const title = note?.title ? `${note.title}` : "Note details";
    const description = (note?.content ?? "").slice(0, 160) || "Note details";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: absoluteUrl(`/notes/${id}`),
        images: [{ url: OG_IMAGE }],
      },
    };
  } catch {
    const title = "Note not found";
    const description = "Note not found or deleted.";
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: absoluteUrl(`/notes/${id}`),
        images: [{ url: OG_IMAGE }],
      },
    };
  }
}

export const revalidate = 0;

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
