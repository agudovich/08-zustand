"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { NoteTag } from "@/types/note";

export type NoteDraft = {
  title: string;
  content: string;
  tag: NoteTag;
};

export const initialDraft: NoteDraft = {
  title: "",
  content: "",
  tag: "Todo",
};

type NoteStore = {
  draft: NoteDraft;
  setDraft: (patch: Partial<NoteDraft>) => void;
  replaceDraft: (draft: NoteDraft) => void;
  clearDraft: () => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      draft: initialDraft,
      setDraft: (patch) => set({ draft: { ...get().draft, ...patch } }),
      replaceDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "notehub-draft-v1",
      partialize: (state) => ({ draft: state.draft }),
      version: 1,
    }
  )
);
