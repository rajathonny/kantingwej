"use client";

import { useState } from "react";
import { HISTORY_STORAGE_KEY, type HistoryEntry } from "@/app/compo/keranjang";
import { rupiah } from "@/data/data";

function readHistoryFromLocalStorage(): HistoryEntry[] {
  if (typeof window === "undefined") return [];

  try {
    const saved = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

export default function RiwayatPage() {
  const [history] = useState<HistoryEntry[]>(() =>
    readHistoryFromLocalStorage(),
  );

  if (history.length === 0) {
    return (
      <div className="py-8">
        <h1 className="text-3xl font-bold text-slate-800">Riwayat pesanan</h1>
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center text-slate-500">
          Belum ada riwayat pesanan.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-8">
      <h1 className="text-3xl font-bold text-slate-800">Riwayat pesanan</h1>

      <div className="space-y-4">
        {history.map((entry, index) => (
          <div
            key={`${entry.tanggal}-${index}`}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-lg font-semibold text-slate-800">
                  {entry.nama}
                </p>
                <p className="text-sm text-slate-500">
                  {new Date(entry.tanggal).toLocaleString("id-ID")}
                </p>
              </div>
              <p className="text-base font-bold text-slate-800">
                {rupiah(entry.total)}
              </p>
            </div>

            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {entry.items.map((item) => (
                <li
                  key={`${entry.tanggal}-${item.id}`}
                  className="flex items-center justify-between gap-3"
                >
                  <span>
                    {item.nama} x{item.jumlah}
                  </span>
                  <span>{rupiah(item.harga * item.jumlah)}</span>
                </li>
              ))}
            </ul>

            <div className="mt-4 space-y-2 border-t border-slate-200 pt-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{rupiah(entry.subtotal)}</span>
              </div>
              {entry.diskon > 0 && (
                <div className="flex items-center justify-between">
                  <span>Diskon</span>
                  <span>-{rupiah(entry.diskon)}</span>
                </div>
              )}
              {entry.ongkir > 0 && (
                <div className="flex items-center justify-between">
                  <span>Ongkir</span>
                  <span>{rupiah(entry.ongkir)}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
