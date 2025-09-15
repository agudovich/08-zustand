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

  hasHydrated: boolean;
  _setHasHydrated: (v: boolean) => void;
};

export const useNoteStore = create<NoteStore>()(
  persist(
    (set, get) => ({
      draft: initialDraft,
      setDraft: (patch) => set({ draft: { ...get().draft, ...patch } }),
      replaceDraft: (draft) => set({ draft }),
      clearDraft: () => set({ draft: initialDraft }),

      hasHydrated: false,
      _setHasHydrated: (v) => set({ hasHydrated: v }),
    }),
    {
      name: "notehub-draft-v1",
      partialize: (state) => ({ draft: state.draft }),
      version: 1,
      onRehydrateStorage: () => (state) => {
        // вызывается, когда persist дочитает localStorage
        state?._setHasHydrated(true);
      },
    }
  )
);
