import type { ReactNode } from "react";

export type Menu = {
  judul: ReactNode;
  terisi: number;
  id: number;
  nama: string;
  kategori: string;
  harga: number;
  stok: number;
};

export const menu: Menu[] = [
  {
    judul: "nasi Goreng Spesial",
    terisi: 0,
    id: 1,
    nama: "nasi Goreng Spesial",
    kategori: "makanan",
    harga: 12000,
    stok: 15,
  },
  {
    judul: "Mie atam",
    terisi: 0,
    id: 2,
    nama: "Mie atam",
    kategori: "makanan",
    harga: 12000,
    stok: 15,
  },
  {
    judul: "Es Teh Manis",
    terisi: 0,
    id: 3,
    nama: "Es Teh Manis",
    kategori: "minuman",
    harga: 12000,
    stok: 15,
  },
  {
    judul: "Jus Alpukat",
    terisi: 0,
    id: 4,
    nama: "Jus Alpukat",
    kategori: "minuman",
    harga: 12000,
    stok: 15,
  },
  {
    judul: "Pisang Goreng Spesial",
    terisi: 0,
    id: 5,
    nama: "Pisang Goreng Spesial",
    kategori: "camilan",
    harga: 12000,
    stok: 15,
  },
  {
    judul: "risol mayo",
    terisi: 0,
    id: 6,
    nama: "risol mayo",
    kategori: "camilan",
    harga: 12000,
    stok: 15,
  },
];

export function rupiah(n: number): string {
  return "Rp" + n.toLocaleString("id-ID");
}
