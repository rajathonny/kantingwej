import Link from "next/link";
import { notFound } from "next/navigation";
import FavoriteButton from "@/app/compo/favorit";
import FormPesen from "@/app/compo/formpesen";
import { menu, rupiah } from "@/data/data";

export function generateStaticParams() {
  return menu.map((item) => ({ id: String(item.id) }));
}

export default async function DetailMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = menu.find((menuItem) => menuItem.id === Number(id));

  if (!item) {
    notFound();
  }

  return (
    <main className="py-10">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Detail menu
        </p>
        <h1 className="mt-3 text-3xl font-bold text-slate-800">{item.nama}</h1>

        <div className="mt-6 space-y-3 text-slate-700">
          <p>
            <span className="font-semibold">Kategori:</span> {item.kategori}
          </p>
          <p>
            <span className="font-semibold">Harga:</span> {rupiah(item.harga)}
          </p>
          <p>
            <span className="font-semibold">Stok:</span>{" "}
            {item.stok === 0 ? "Habis" : `${item.stok} tersedia`}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/menu"
            className="inline-flex rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Kembali ke katalog
          </Link>
          <FavoriteButton menuId={item.id} />
        </div>

        <div className="mt-6">
          <FormPesen menu={item} />
        </div>
      </div>
    </main>
  );
}
