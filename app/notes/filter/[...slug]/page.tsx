import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";
import type { SelectedTag } from "@/types/note";
import type { Metadata } from "next";
import { absoluteUrl, OG_IMAGE } from "@/lib/seo";

export const revalidate = 0;

type Params = { slug?: string[] };
type Search = { page?: string; q?: string };

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const tag = decodeURIComponent(slug?.[0] ?? "All");
  const isAll = tag === "All";

  const title = isAll ? "All notes" : `Notes — ${tag}`;
  const description = isAll ? "All notes" : `All notes with tag "${tag}"`;

  const url = absoluteUrl(`/notes/filter/${encodeURIComponent(tag)}`);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [{ url: OG_IMAGE }],
    },
  };
}

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
