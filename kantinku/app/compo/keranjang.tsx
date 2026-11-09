"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { menu, rupiah, type Menu } from "@/data/data";

export const CART_STORAGE_KEY = "keranjang";
export const HISTORY_STORAGE_KEY = "riwayat";

export type CartRow = {
  id: number;
  jumlah: number;
};

export type HistoryEntry = {
  nama: string;
  tanggal: string;
  items: Array<{
    id: number;
    nama: string;
    harga: number;
    jumlah: number;
  }>;
  subtotal: number;
  diskon: number;
  ongkir: number;
  total: number;
};

export function dispatchCartChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("keranjang-berubah"));
  }
}

export function readCart(): CartRow[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(CART_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item): item is CartRow =>
        item &&
        typeof item.id === "number" &&
        typeof item.jumlah === "number" &&
        Number.isFinite(item.jumlah),
    );
  } catch {
    return [];
  }
}

export function saveCart(items: CartRow[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  dispatchCartChange();
}

export function readHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];

    if (!Array.isArray(parsed)) return [];

    return parsed as HistoryEntry[];
  } catch {
    return [];
  }
}

export function saveHistory(entries: HistoryEntry[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(entries));
}

export function getCartCount(): number {
  return readCart().reduce((total, item) => total + item.jumlah, 0);
}

export function useCartCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const hitung = () => setCount(getCartCount());

    hitung();
    window.addEventListener("keranjang-berubah", hitung);

    return () => {
      window.removeEventListener("keranjang-berubah", hitung);
    };
  }, []);

  return count;
}

export function addToCart(item: Menu, jumlah: number) {
  if (item.stok <= 0) {
    return { success: false, message: "Menu ini habis." };
  }

  const nilai = Number(jumlah);

  if (!Number.isFinite(nilai) || nilai < 1) {
    return { success: false, message: "Jumlah minimal 1." };
  }

  const safeJumlah = Math.min(Math.max(Math.round(nilai), 1), item.stok);
  const rows = readCart();
  const existing = rows.find((row) => row.id === item.id);
  const totalJumlah = (existing?.jumlah ?? 0) + safeJumlah;

  if (totalJumlah > item.stok) {
    return {
      success: false,
      message: `Jumlah tidak boleh lebih dari stok (${item.stok}).`,
    };
  }

  const next = existing
    ? rows.map((row) =>
        row.id === item.id ? { ...row, jumlah: row.jumlah + safeJumlah } : row,
      )
    : [...rows, { id: item.id, jumlah: safeJumlah }];

  saveCart(next);

  return { success: true, message: "Ditambahkan ke keranjang." };
}

export function FormTambahKeranjang({ item }: { item: Menu }) {
  const [jumlah, setJumlah] = useState(1);
  const [status, setStatus] = useState("");

  if (item.stok === 0) {
    return (
      <p className="mt-4 text-sm font-medium text-red-600">Menu ini habis.</p>
    );
  }

  const total = item.harga * jumlah;

  const handleChange = (value: string) => {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      setJumlah(1);
      return;
    }

    const safe = Math.min(Math.max(Math.round(parsed), 1), item.stok);
    setJumlah(safe);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = addToCart(item, jumlah);
    setStatus(result.message);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <label
          htmlFor={`jumlah-${item.id}`}
          className="text-sm font-medium text-slate-700"
        >
          Jumlah
        </label>
        <input
          id={`jumlah-${item.id}`}
          type="number"
          min={1}
          max={item.stok}
          value={jumlah}
          onChange={(event) => handleChange(event.target.value)}
          className="w-20 rounded-lg border border-slate-300 px-2 py-1.5 text-sm outline-none focus:border-blue-500"
        />
      </div>

      <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
        <span>Total</span>
        <strong className="text-base text-slate-800">{rupiah(total)}</strong>
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
      >
        Tambah ke keranjang
      </button>

      {status ? (
        <p
          className={
            status.includes("Ditambahkan")
              ? "mt-3 text-sm text-emerald-600"
              : "mt-3 text-sm text-red-600"
          }
        >
          {status}
        </p>
      ) : null}
    </form>
  );
}

export function KeranjangView() {
  const [rows, setRows] = useState<CartRow[]>(() => readCart());
  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [promoDipakai, setPromoDipakai] = useState(false);
  const [metode, setMetode] = useState<"ambil" | "diantar">("ambil");
  const [kelas, setKelas] = useState("");
  const [namaPemesan, setNamaPemesan] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState("");

  useEffect(() => {
    const sync = () => setRows(readCart());

    sync();
    window.addEventListener("keranjang-berubah", sync);

    return () => {
      window.removeEventListener("keranjang-berubah", sync);
    };
  }, []);

  const items = useMemo(
    () =>
      rows
        .map((row) => {
          const menuItem = menu.find((item) => item.id === row.id);

          if (!menuItem) return null;

          return {
            ...menuItem,
            jumlah: row.jumlah,
          };
        })
        .filter(Boolean) as Array<Menu & { jumlah: number }>,
    [rows],
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.harga * item.jumlah, 0),
    [items],
  );

  const promoAktif = promoDipakai && subtotal >= 20000;

  const diskon = useMemo(() => {
    if (!promoAktif) return 0;
    return Math.round(subtotal * 0.1);
  }, [promoAktif, subtotal]);

  const ongkir = metode === "diantar" ? 2000 : 0;
  const total = subtotal - diskon + ongkir;

  const updateJumlah = (id: number, nextJumlah: number) => {
    const item = menu.find((menuItem) => menuItem.id === id);

    if (!item) return;

    const safeJumlah = Math.min(Math.max(nextJumlah, 1), item.stok);
    const nextRows = rows.map((row) =>
      row.id === id ? { ...row, jumlah: safeJumlah } : row,
    );

    setRows(nextRows);
    saveCart(nextRows);
  };

  const hapusItem = (id: number) => {
    const nextRows = rows.filter((row) => row.id !== id);
    setRows(nextRows);
    saveCart(nextRows);
  };

  const handlePromo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const code = promoInput.trim().toUpperCase();

    if (code !== "HEMATIO") {
      setPromoDipakai(false);
      setPromoMessage("Kode promo tidak dikenal.");
      return;
    }

    if (subtotal < 20000) {
      setPromoDipakai(false);
      setPromoMessage("Promo HEMATIO butuh belanja minimal Rp 20.000.");
      return;
    }

    setPromoDipakai(true);
    setPromoMessage("Promo HEMATIO dipakai: diskon 10%.");
  };

  const handleCheckout = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (namaPemesan.trim().length < 3) {
      setCheckoutMessage("Nama pemesan minimal 3 huruf.");
      return;
    }

    if (metode === "diantar" && kelas.trim().length === 0) {
      setCheckoutMessage("Kelas wajib diisi untuk pengiriman.");
      return;
    }

    const entry: HistoryEntry = {
      nama: namaPemesan.trim(),
      tanggal: new Date().toISOString(),
      items: items.map((item) => ({
        id: item.id,
        nama: item.nama,
        harga: item.harga,
        jumlah: item.jumlah,
      })),
      subtotal,
      diskon,
      ongkir,
      total,
    };

    const history = readHistory();
    saveHistory([...history, entry]);

    setCheckoutMessage(`Terima kasih, ${namaPemesan.trim()}!`);

    setRows([]);
    saveCart([]);
    setPromoInput("");
    setPromoDipakai(false);
    setPromoMessage("");
    setMetode("ambil");
    setKelas("");
    setNamaPemesan("");
  };

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-500">
        Keranjang masih kosong.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {item.nama}
                  </h3>
                  <p className="text-sm text-slate-500">{item.kategori}</p>
                </div>
                <button
                  type="button"
                  onClick={() => hapusItem(item.id)}
                  className="text-sm font-medium text-red-500 hover:text-red-600"
                >
                  Hapus
                </button>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => updateJumlah(item.id, item.jumlah - 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-slate-50 text-lg font-medium text-slate-700"
                    aria-label={`Kurangi ${item.nama}`}
                  >
                    −
                  </button>
                  <span className="min-w-10 text-center text-sm font-medium text-slate-700">
                    {item.jumlah}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateJumlah(item.id, item.jumlah + 1)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-slate-50 text-lg font-medium text-slate-700"
                    aria-label={`Tambah ${item.nama}`}
                  >
                    +
                  </button>
                </div>

                <p className="text-base font-semibold text-slate-800">
                  {rupiah(item.harga * item.jumlah)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <aside className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <strong>{rupiah(subtotal)}</strong>
            </div>
            {diskon > 0 && (
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Diskon</span>
                <strong className="text-emerald-600">-{rupiah(diskon)}</strong>
              </div>
            )}
            {ongkir > 0 && (
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Ongkir</span>
                <strong>{rupiah(ongkir)}</strong>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-800">
              <span>Total</span>
              <span>{rupiah(total)}</span>
            </div>
          </div>

          <form onSubmit={handlePromo} className="space-y-3">
            <label className="block text-sm font-medium text-slate-700">
              Kode promo
            </label>
            <div className="flex gap-2">
              <input
                value={promoInput}
                onChange={(event) => setPromoInput(event.target.value)}
                placeholder="HEMATIO"
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="rounded-lg bg-slate-800 px-3 py-2 text-sm font-medium text-white hover:bg-slate-900"
              >
                Pakai
              </button>
            </div>
            {promoMessage ? (
              <p
                className={
                  promoMessage.includes("dipakai")
                    ? "text-sm text-emerald-600"
                    : "text-sm text-red-600"
                }
              >
                {promoMessage}
              </p>
            ) : null}
          </form>

          <form onSubmit={handleCheckout} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Nama pemesan
              </label>
              <input
                value={namaPemesan}
                onChange={(event) => setNamaPemesan(event.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Ambil pesanan
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    checked={metode === "ambil"}
                    onChange={() => setMetode("ambil")}
                    name="metode"
                  />
                  Ambil sendiri
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    checked={metode === "diantar"}
                    onChange={() => setMetode("diantar")}
                    name="metode"
                  />
                  Diantar
                </label>
              </div>
            </div>

            {metode === "diantar" && (
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Kelas
                </label>
                <input
                  value={kelas}
                  onChange={(event) => setKelas(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>
            )}

            {checkoutMessage ? (
              <p
                className={
                  checkoutMessage.startsWith("Terima kasih")
                    ? "text-sm text-emerald-600"
                    : "text-sm text-red-600"
                }
              >
                {checkoutMessage}
              </p>
            ) : null}

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
            >
              Pesan sekarang
            </button>
          </form>
        </aside>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
        <Link
          href="/menu"
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          + Lanjutkan belanja
        </Link>
      </div>
    </div>
  );
}
