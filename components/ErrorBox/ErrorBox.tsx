"use client";
import css from "./ErrorBox.module.css";

export default function ErrorBox({ message }: { message: string }) {
  return <div className={css.error}>{message}</div>;
}
