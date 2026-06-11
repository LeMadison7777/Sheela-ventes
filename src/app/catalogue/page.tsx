import { Suspense } from "react";
import { prisma } from "@/lib/prisma";
import { FadeIn, GradientText } from "@/components/ui/motion";
import ProductCard from "@/components/cards/ProductCard";
import CatalogueFilters from "@/components/catalogue/CatalogueFilters";

type SearchParams = Promise<{ category?: string; search?: string; product?: string }>;

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const [categories, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.product.findMany({
      where: {
        ...(params.category ? { category: { slug: params.category } } : {}),
        ...(params.search
          ? {
              OR: [
                { name: { contains: params.search } },
                { description: { contains: params.search } },
              ],
            }
          : {}),
      },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="mb-10">
          <h1 className="text-4xl font-bold mb-2">
            <GradientText>Catalogue</GradientText> complet
          </h1>
          <p className="text-zinc-500">
            {products.length} article{products.length !== 1 ? "s" : ""} disponible{products.length !== 1 ? "s" : ""}
          </p>
        </FadeIn>

        <Suspense>
          <CatalogueFilters categories={categories} />
        </Suspense>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {products.map((product, i) => (
            <FadeIn key={product.id} delay={i * 0.05}>
              <ProductCard product={product} />
            </FadeIn>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            Aucun article trouvé pour cette recherche.
          </div>
        )}
      </div>
    </div>
  );
}
