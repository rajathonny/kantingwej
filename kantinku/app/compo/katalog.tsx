"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { rupiah, type Menu } from "@/data/data";

export default function Katalog({ menu }: { menu: Menu[] }) {
  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [urut, setUrut] = useState("tanggal");
  const [hanyaTersedia, setHanyaTersedia] = useState(false);
  const [hargaMaksimal, setHargaMaksimal] = useState("");

  const kategoriList = ["Semua", ...new Set(menu.map((item) => item.kategori))];

  const hasil = useMemo(() => {
    const query = cari.trim().toLowerCase();
    const maxHarga =
      hargaMaksimal === "" ? Number.POSITIVE_INFINITY : Number(hargaMaksimal);

    const filtered = menu.filter((item) => {
      const cocokCari =
        query === "" ||
        item.nama.toLowerCase().includes(query) ||
        String(item.judul).toLowerCase().includes(query);
      const cocokKategori = kategori === "Semua" || item.kategori === kategori;
      const cocokTersedia = !hanyaTersedia || item.stok > 0;
      const cocokHarga = item.harga <= maxHarga;

      return cocokCari && cocokKategori && cocokTersedia && cocokHarga;
    });

    const sorted = [...filtered];

    switch (urut) {
      case "harga-termurah":
        return sorted.sort((a, b) => a.harga - b.harga);
      case "harga-termahal":
        return sorted.sort((a, b) => b.harga - a.harga);
      case "nama-az":
        return sorted.sort((a, b) => a.nama.localeCompare(b.nama));
      default:
        return sorted.sort((a, b) => a.id - b.id);
    }
  }, [cari, kategori, hargaMaksimal, hanyaTersedia, menu, urut]);

  return (
    <section className="space-y-5">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <input
          value={cari}
          onChange={(e) => setCari(e.target.value)}
          placeholder="Cari menu"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-blue-500"
        />

        <select
          value={kategori}
          onChange={(e) => setKategori(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
        >
          {kategoriList.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={urut}
          onChange={(e) => setUrut(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500"
        >
          <option value="tanggal">Urutan awal</option>
          <option value="harga-termurah">Harga termurah</option>
          <option value="harga-termahal">Harga termahal</option>
          <option value="nama-az">Nama A-Z</option>
        </select>

        <input
          type="number"
          min="0"
          value={hargaMaksimal}
          onChange={(e) => setHargaMaksimal(e.target.value)}
          placeholder="Harga maksimal"
          className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={hanyaTersedia}
          onChange={(e) => setHanyaTersedia(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        Tampilkan hanya yang tersedia
      </label>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
        {hasil.length} menu ditampilkan
      </div>

      {hasil.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-slate-500">
          Menu tidak ditemukan.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {hasil.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium capitalize text-blue-700">
                  {item.kategori}
                </span>
                {item.stok === 0 && (
                  <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700">
                    Habis
                  </span>
                )}
              </div>

              <h3 className="text-lg font-semibold text-slate-800">
                {item.nama}
              </h3>
              <p className="mt-3 text-base font-medium text-slate-700">
                {rupiah(item.harga)}
              </p>
              <p
                className={
                  item.stok === 0
                    ? "mt-2 text-sm text-red-600"
                    : "mt-2 text-sm text-green-700"
                }
              >
                {item.stok === 0 ? "Stok habis" : `Sisa ${item.stok} stok`}
              </p>

              <div className="mt-4 flex items-center justify-between gap-3">
                <Link
                  href={`/menu/${item.id}`}
                  className="inline-flex rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Lihat detail
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
