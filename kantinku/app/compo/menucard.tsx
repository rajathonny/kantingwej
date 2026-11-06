import Link from "next/link";
import { Menu, rupiah } from "@/data/data";

export default function Menucard({ menu }: { menu: Menu }) {
  const sisa = menu.stok - menu.terisi;
  const laris = sisa > 0 && menu.terisi / menu.stok >= 0.5;

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
        {menu.kategori}
      </span>

      {laris && (
        <span className="ml-2 rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
          Laris
        </span>
      )}

      <h3 className="mt-2 text-lg font-semibold">{menu.judul}</h3>
      <p className="mt-2 font-medium">{rupiah(menu.harga)}</p>

      <p
        className={
          sisa === 0 ? "text-sm text-red-600" : "text-sm text-green-700"
        }
      >
        {sisa === 0 ? "Stok his" : `Sisa ${sisa} stok`}
      </p>

      <Link
        href="#"
        className="mt-3 inline-block rounded bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
      >
        Pilih
      </Link>
    </div>
  );
}
