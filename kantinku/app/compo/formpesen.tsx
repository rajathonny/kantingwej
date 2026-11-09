"use client";

import { useState } from "react";
import { addToCart } from "@/app/compo/keranjang";
import { rupiah, type Menu } from "@/data/data";

export default function FormPesen({ menu }: { menu?: Menu }) {
  const [jumlah, setJumlah] = useState(1);
  const [status, setStatus] = useState("");

  if (!menu) {
    return null;
  }

  const total = menu.harga * jumlah;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = addToCart(menu, jumlah);
    setStatus(result.message);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between gap-3">
        <label htmlFor="jumlah" className="text-sm font-medium text-slate-700">
          Jumlah
        </label>
        <input
          id="jumlah"
          type="number"
          min={1}
          max={menu.stok}
          value={jumlah}
          onChange={(event) => {
            const next = Number(event.target.value);
            setJumlah(
              Number.isFinite(next)
                ? Math.min(Math.max(Math.round(next), 1), menu.stok)
                : 1,
            );
          }}
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
        Pesan sekarang
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
