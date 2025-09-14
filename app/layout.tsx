// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

import { Roboto } from "next/font/google";
import { SITE_URL, OG_IMAGE } from "@/lib/seo";

import Providers from "./providers";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "NoteHub",
    template: "%s | NoteHub",
  },
  description: "NoteHub — best notepad. Next.js App Router + React Query.",
  openGraph: {
    title: "NoteHub",
    description: "NoteHub — best notepad. Next.js App Router + React Query.",
    url: SITE_URL,
    siteName: "NoteHub",
    images: [{ url: OG_IMAGE }],
    type: "website",
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.variable}>
      <body>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          {modal}
        </Providers>
      </body>
    </html>
  );
}
