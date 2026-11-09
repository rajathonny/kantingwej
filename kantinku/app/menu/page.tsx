import KatalogInteraktif from "@/app/compo/katalog";
import { menu } from "@/data/data";

export default function MenuPage() {
  return (
    <div className="space-y-6 py-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
          Katalog
        </p>
        <h1 className="text-3xl font-bold text-slate-800">Menu tersedia</h1>
      </div>

      <KatalogInteraktif menu={menu} />
    </div>
  );
}
