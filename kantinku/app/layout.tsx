import type { Metadata } from "next";
import "./globals.css";
import type { ReactNode } from "react";
import { FavoriteProvider } from "./compo/favorit";
import Navbar from "./compo/navbar";

export const metadata: Metadata = {
  title: "kantinku",
  description: "pesan makanan yang ada di kantin di sini",
};

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="id" className="antialiased">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
        <FavoriteProvider>
          <Navbar />
          <main className="mx-auto w-full max-w-5xl flex-1 p-6">
            {children}
          </main>
          <footer className="border-t bg-white p-4 text-center text-sm text-slate-500">
            kantinku di buat di kelas junios dev
          </footer>
        </FavoriteProvider>
      </body>
    </html>
  );
}
