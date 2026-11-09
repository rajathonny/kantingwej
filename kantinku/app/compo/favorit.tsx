"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { menu, rupiah } from "@/data/data";

const STORAGE_KEY = "kantinku-favorites";

type FavoriteContextValue = {
  favoriteIds: number[];
  isFavorite: (id: number) => boolean;
  toggleFavorite: (id: number) => void;
};

const FavoriteContext = createContext<FavoriteContextValue | null>(null);

function readFavorites(): number[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter((value): value is number => Number.isInteger(value));
  } catch {
    return [];
  }
}

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(() =>
    readFavorites(),
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    }
  }, [favoriteIds]);

  const value = useMemo<FavoriteContextValue>(() => {
    const isFavorite = (id: number) => favoriteIds.includes(id);

    const toggleFavorite = (id: number) => {
      setFavoriteIds((current) =>
        current.includes(id)
          ? current.filter((favoriteId) => favoriteId !== id)
          : [...current, id],
      );
    };

    return { favoriteIds, isFavorite, toggleFavorite };
  }, [favoriteIds]);

  return (
    <FavoriteContext.Provider value={value}>
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);

  if (!context) {
    throw new Error("useFavorites harus dipakai di dalam FavoriteProvider");
  }

  return context;
}

export default function FavoriteButton({ menuId }: { menuId: number }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(menuId);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(menuId)}
      aria-label={active ? "Hapus dari favorit" : "Tambahkan ke favorit"}
      className={
        active
          ? "inline-flex items-center gap-1 border-0 bg-transparent p-0 text-sm font-medium text-rose-500 shadow-none outline-none ring-0 transition hover:text-rose-600 focus:outline-none focus:ring-0"
          : "inline-flex items-center gap-1 border-0 bg-transparent p-0 text-sm font-medium text-slate-500 shadow-none outline-none ring-0 transition hover:text-rose-500 focus:outline-none focus:ring-0"
      }
    >
      <span aria-hidden="true" className="text-lg leading-none">
        {active ? "♥" : "♡"}
      </span>
      <span>{active ? "Favorit" : "Favorit"}</span>
    </button>
  );
}

export function FavoriteList() {
  const { favoriteIds } = useFavorites();
  const favoriteMenu = menu.filter((item) => favoriteIds.includes(item.id));

  if (favoriteMenu.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-500">
        Belum ada menu favorit yang disimpan.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {favoriteMenu.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          <div className="mb-3">
            <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium capitalize text-blue-700">
              {item.kategori}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-slate-800">{item.nama}</h3>
          <p className="mt-3 text-base font-medium text-slate-700">
            {rupiah(item.harga)}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <Link
              href={`/menu/${item.id}`}
              className="inline-flex rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Lihat detail
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
