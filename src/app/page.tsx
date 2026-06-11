import Link from "next/link";
import { ArrowRight, ShoppingBag, TrendingUp, Users, Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { FadeIn, GradientText, GlassCard } from "@/components/ui/motion";
import HeroSection from "@/components/home/HeroSection";
import CategoryGrid from "@/components/cards/CategoryGrid";
import ProductCard from "@/components/cards/ProductCard";
import GroupCard from "@/components/cards/GroupCard";

async function getData() {
  const [categories, products, groups] = await Promise.all([
    prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { featured: true },
      include: { category: true },
      take: 4,
    }),
    prisma.saleGroup.findMany({
      where: { status: "open" },
      include: {
        vendor: { select: { name: true, avatar: true } },
        _count: { select: { orders: true } },
      },
      take: 3,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return {
    categories,
    products,
    groups: groups.map((g) => ({ ...g, currentCount: g._count.orders })),
  };
}

export default async function HomePage() {
  const { categories, products, groups } = await getData();

  const stats = [
    { icon: Users, label: "Créatrices actives", value: "500+" },
    { icon: ShoppingBag, label: "Commandes/mois", value: "12K" },
    { icon: TrendingUp, label: "Économie moyenne", value: "-25%" },
    { icon: Zap, label: "Livraison groupée", value: "3 sem." },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <HeroSection />
        <div className="gradient-mesh absolute inset-0 -z-10" />

        <div className="mx-auto max-w-7xl px-6 pt-32 pb-20 w-full">
          <div className="max-w-3xl">
            <FadeIn>
              <div className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-1.5 text-sm text-pink-300 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500" />
                </span>
                Plateforme #1 ventes groupées
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                Vos ventes groupées,{" "}
                <GradientText>sublimées</GradientText>
              </h1>
            </FadeIn>

            <FadeIn delay={0.2}>
              <p className="text-lg text-zinc-400 mb-8 max-w-xl leading-relaxed">
                Habits, accessoires, parfums, chaussures, ongles — organisez vos
                commandes groupées style Shein avec style. Gérez vos membres,
                suivez vos ventes, tout en un.
              </p>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/groupes"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-pink-500/30 hover:scale-105 transition-transform"
                >
                  Voir les groupes
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/inscription"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white backdrop-blur hover:bg-white/10 transition-colors"
                >
                  Devenir vendeuse
                </Link>
              </div>
            </FadeIn>
          </div>

          {/* Stats */}
          <FadeIn delay={0.5} className="mt-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <GlassCard key={stat.label} className="p-5 text-center" hover={false}>
                  <stat.icon className="h-5 w-5 text-pink-400 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-zinc-500 mt-1">{stat.label}</div>
                </GlassCard>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Toutes les <GradientText>catégories</GradientText>
            </h2>
            <p className="text-zinc-500 max-w-lg mx-auto">
              Du prêt-à-porter aux ongles press-on, couvrez tous vos univers de vente
            </p>
          </FadeIn>
          <CategoryGrid categories={categories} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 px-6 gradient-mesh">
        <div className="mx-auto max-w-7xl">
          <FadeIn className="flex items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                Tendances du <GradientText>moment</GradientText>
              </h2>
              <p className="text-zinc-500">Les articles les plus demandés en ce moment</p>
            </div>
            <Link href="/catalogue" className="hidden md:flex items-center gap-1 text-sm text-pink-400 hover:text-pink-300">
              Tout voir <ArrowRight className="h-4 w-4" />
            </Link>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <FadeIn key={product.id}>
                <ProductCard product={product} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Active Groups */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Groupes <GradientText>ouverts</GradientText>
            </h2>
            <p className="text-zinc-500">Rejoignez une commande groupée en cours</p>
          </FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {groups.map((group, i) => (
              <FadeIn key={group.id} delay={i * 0.1}>
                <GroupCard group={group} />
              </FadeIn>
            ))}
          </div>
          {groups.length === 0 && (
            <p className="text-center text-zinc-500">Aucun groupe ouvert pour le moment.</p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="mx-auto max-w-4xl">
          <FadeIn>
            <GlassCard className="p-12 text-center relative overflow-hidden" hover={false}>
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-violet-500/10 to-amber-500/5" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Lancez votre propre <GradientText>groupe de vente</GradientText>
                </h2>
                <p className="text-zinc-400 mb-8 max-w-md mx-auto">
                  Inscrivez-vous gratuitement, ajoutez vos articles et invitez votre communauté à commander ensemble.
                </p>
                <Link
                  href="/groupes/creer"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-8 py-4 text-sm font-semibold text-white shadow-xl shadow-pink-500/30 hover:scale-105 transition-transform"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Créer mon groupe
                </Link>
              </div>
            </GlassCard>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
