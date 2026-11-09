import { FavoriteList } from "@/app/compo/favorit";

export default function FavoritPage() {
  return (
    <div className="space-y-6 py-8">
      <div className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
          Favorit
        </p>
        <h1 className="text-3xl font-bold text-slate-800">Menu favorit kamu</h1>
      </div>

      <FavoriteList />
    </div>
  );
}
