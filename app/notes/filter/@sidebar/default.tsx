"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import css from "./sidebar.module.css";

const TAGS = [
  "All",
  "Todo",
  "Work",
  "Personal",
  "Meeting",
  "Shopping",
] as const;

export default function SidebarNotes() {
  const pathname = usePathname();
  const current = (pathname?.split("/").pop() ||
    "All") as (typeof TAGS)[number];

  return (
    <ul className={css.menuList}>
      {TAGS.map((tag) => {
        const href =
          tag === "All" ? "/notes/filter/All" : `/notes/filter/${tag}`;
        const isActive = current === tag;
        return (
          <li key={tag} className={css.menuItem}>
            <Link
              href={href}
              scroll={false}
              className={`${css.menuLink} ${isActive ? css.active : ""}`}>
              {tag}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
