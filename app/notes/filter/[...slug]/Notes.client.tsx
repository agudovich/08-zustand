"use client";

import { useState } from "react";
import { useDebounce } from "use-debounce";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { fetchNotes, type FetchNotesResponse } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";
import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import type { SelectedTag } from "@/types/note";
import css from "./page.module.css";

export interface NotesClientProps {
  initialPage: number;
  perPage: number;
  initialQuery: string;
  tag: SelectedTag;
}

export default function NotesClient({
  initialPage,
  perPage,
  initialQuery,
  tag,
}: NotesClientProps) {
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialQuery);
  const [debouncedSearch] = useDebounce(search, 400);

  const { data } = useQuery<FetchNotesResponse>({
    queryKey: ["notes", page, perPage, debouncedSearch, tag],
    queryFn: () => fetchNotes({ page, perPage, search: debouncedSearch, tag }),
    placeholderData: (prev) => prev,
  });

  const totalPages = data?.totalPages ?? 1;
  const notes = data?.notes ?? [];

  return (
    <main>
      <div className={css.toolbar}>
        <SearchBox
          value={search}
          onChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
        />

        {totalPages > 1 && (
          <Pagination
            pageCount={totalPages}
            currentPage={page}
            onPageChange={setPage}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </div>

      <NoteList notes={notes} />
    </main>
  );
}
