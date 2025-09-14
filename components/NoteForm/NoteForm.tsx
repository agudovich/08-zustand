"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "@/lib/api";
import type { NoteTag } from "@/types/note";
import { useNoteStore, initialDraft } from "@/lib/store/noteStore";
import css from "./NoteForm.module.css";

export interface NoteFormProps {
  onCancel?: () => void;
}

export default function NoteForm({ onCancel }: NoteFormProps) {
  const router = useRouter();
  const qc = useQueryClient();
  const { draft, setDraft, replaceDraft, clearDraft } = useNoteStore();
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(draft.title);
  const [content, setContent] = useState(draft.content);
  const [tag, setTag] = useState<NoteTag>(draft.tag);

  useEffect(() => {
    if (!draft || (!draft.title && !draft.content && !draft.tag)) {
      replaceDraft(initialDraft);
      setTitle(initialDraft.title);
      setContent(initialDraft.content);
      setTag(initialDraft.tag);
    } else {
      setTitle(draft.title);
      setContent(draft.content);
      setTag(draft.tag);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setDraft({ title, content, tag });
  }, [title, content, tag, setDraft]);

  const { mutateAsync, isPending: isCreating } = useMutation({
    mutationFn: async () =>
      createNote({
        title: title.trim(),
        content: content.trim(),
        tag,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["notes"] });
      clearDraft();
    },
  });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) return;
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

  return (
    <form className={css.form} onSubmit={onSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          type="text"
          className={css.input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={500}
        />
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          className={css.select}
          value={tag}
          onChange={(e) => setTag(e.target.value as NoteTag)}>
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
          disabled={isPending || isCreating || title.trim().length < 3}>
          {isCreating ? "Creating..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
