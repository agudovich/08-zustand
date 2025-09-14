"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import css from "./TagsMenu.module.css";

const TAGS = [
  "All",
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;

export default function TagsMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return (
    <div className={css.menuContainer} ref={ref}>
      <button
        className={css.menuButton}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}>
        Notes ▾
      </button>

      {open && (
        <ul className={css.menuList} role="menu">
          {TAGS.map((tag) => {
            const href =
              tag === "All" ? "/notes/filter/All" : `/notes/filter/${tag}`;
            return (
              <li className={css.menuItem} role="none" key={tag}>
                <Link
                  href={href}
                  className={css.menuLink}
                  role="menuitem"
                  onClick={() => setOpen(false)}>
                  {tag}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
