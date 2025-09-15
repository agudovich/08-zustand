"use client";

import { FormEvent, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NoteTag } from "@/types/note";
import css from "./NoteForm.module.css";

export interface NoteFormProps {
  onCancel?: () => void;
}

export default function NoteForm({ onCancel }: NoteFormProps) {
  const router = useRouter();
  const qc = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const {
    draft,
    setDraft,
    clearDraft,
    hasHydrated, // ждём, пока persist дочитает localStorage
  } = useNoteStore();

  const { mutateAsync, isPending: isCreating } = useMutation({
    mutationFn: async () =>
      createNote({
        title: draft.title.trim(),
        content: draft.content.trim(),
        tag: draft.tag,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
    },
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!draft.title.trim()) return;
    try {
      await mutateAsync();
      startTransition(() => router.back());
    } catch (err) {
      console.error(err);
    }
  }

  function handleCancel() {
    if (onCancel) onCancel();
    else router.back();
  }

  if (!hasHydrated) {
    return null;
  }

  return (
    <form className={css.form} onSubmit={onSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={draft.title}
          onChange={(e) => setDraft({ title: e.target.value })}
          minLength={3}
          maxLength={50}
          required
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          value={draft.content}
          onChange={(e) => setDraft({ content: e.target.value })}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={draft.tag}
          onChange={(e) => setDraft({ tag: e.target.value as NoteTag })}>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={isPending || isCreating}>
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={isPending || isCreating || draft.title.trim().length < 3}>
          {isCreating ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
