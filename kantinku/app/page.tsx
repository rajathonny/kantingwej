import Link from "next/link";

export default function Beranda() {
  return (
    <div>
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold">
          Temukan menu makanan yang ada di kantin
        </h1>
        <p className="mt-3 text-slate-600">Beragam makanan ada di sini</p>
        <Link
          href="/menu"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
        >
          lihat semua menu
        </Link>
      </section>
    </div>
  );
}
