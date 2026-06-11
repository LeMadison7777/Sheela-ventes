"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Category = { id: string; name: string; slug: string };

export default function CatalogueFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") ?? "";
  const search = searchParams.get("search") ?? "";

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`/catalogue?${params.toString()}`);
  }

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <input
          type="text"
          placeholder="Rechercher un article..."
          defaultValue={search}
          onChange={(e) => {
            const val = e.target.value;
            clearTimeout((window as unknown as { _searchTimer?: ReturnType<typeof setTimeout> })._searchTimer);
            (window as unknown as { _searchTimer?: ReturnType<typeof setTimeout> })._searchTimer = setTimeout(
              () => updateParams("search", val),
              400
            );
          }}
          className="w-full rounded-full border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/30"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => updateParams("category", "")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition-all",
            !activeCategory
              ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white"
              : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
          )}
        >
          Tous
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateParams("category", cat.slug)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              activeCategory === cat.slug
                ? "bg-gradient-to-r from-pink-500 to-violet-600 text-white"
                : "bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10"
            )}
          >
            {cat.name}
          </button>
        ))}
      </div>
    </div>
  );
}
