import { KeranjangView } from "@/app/compo/keranjang";

export default function KeranjangPage() {
  return (
    <div className="space-y-6 py-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Keranjang
        </p>
        <h1 className="text-3xl font-bold text-slate-800">Pesanan kamu</h1>
      </div>

      <KeranjangView />
    </div>
  );
}
