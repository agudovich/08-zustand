import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import type { SelectedTag } from "@/types/note";

export const revalidate = 0;

type Params = { slug?: string[] };
type Search = { page?: string; q?: string };

export default async function NotesFilterPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Search>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);

  const page = Number(sp.page ?? "1") || 1;
  const perPage = 12;
  const q = (sp.q ?? "").trim();
  const tag = (slug?.[0] ?? "All") as SelectedTag;

  const qc = new QueryClient();
  await qc.prefetchQuery({
    queryKey: ["notes", page, perPage, q, tag],
    queryFn: () => fetchNotes({ page, perPage, search: q, tag }),
  });

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient
        initialPage={page}
        perPage={perPage}
        initialQuery={q}
        tag={tag}
      />
    </HydrationBoundary>
  );
}
