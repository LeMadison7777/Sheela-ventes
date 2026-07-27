import { prisma } from "@/lib/prisma";
import { FadeIn, GradientText } from "@/components/ui/motion";
import GroupCard from "@/components/cards/GroupCard";

// ⬇️ Ajoute cette ligne magique ici pour forcer le rechargement en direct
export const dynamic = "force-dynamic";

export default async function GroupesPage() {
  const groups = await prisma.saleGroup.findMany({
    include: {
      vendor: { select: { name: true, avatar: true } },
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const enriched = groups.map((g) => ({ ...g, currentCount: g._count.orders }));
  
  // Reste du code...

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="mb-10">
          <h1 className="text-4xl font-bold mb-2">
            Groupes de <GradientText>vente</GradientText>
          </h1>
          <p className="text-zinc-500">
            Rejoignez une commande groupée ou créez la vôtre
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enriched.map((group, i) => (
            <FadeIn key={group.id} delay={i * 0.08}>
              <GroupCard group={group} />
            </FadeIn>
          ))}
        </div>

        {enriched.length === 0 && (
          <div className="text-center py-20 text-zinc-500">
            Aucun groupe pour le moment. Soyez la première à en créer un !
          </div>
        )}
      </div>
    </div>
  );
}
