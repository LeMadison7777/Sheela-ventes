import Image from "next/image";
import { notFound } from "next/navigation";
import { Users, Calendar, Percent, User } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { FadeIn, GradientText, GlassCard, Badge } from "@/components/ui/motion";
import { formatDate, daysLeft, formatPrice } from "@/lib/utils";
import { GROUP_STATUS } from "@/lib/constants";
import JoinGroupForm from "@/components/groups/JoinGroupForm";
import ShareGroupButton from "@/components/groups/ShareGroupButton";
import GroupHeaderActions from "@/app/groupes/GroupHeaderActions";
import AddProductButton from "../AddProductButton";

// Importe ta fonction de session selon ton auth (ex: NextAuth auth() ou getServerSession)
// import { auth } from "@/auth"; 


type Params = { params: Promise<{ id: string }> };

export default async function GroupDetailPage({ params }: Params) {
  const { id } = await params;

  // Récupération de la session utilisateur (adapte selon ton système d'authentification)
  // const session = await auth();
  // const currentUserId = session?.user?.id;
  const currentUserId = ""; // À remplacer par l'ID de l'utilisateur connecté de ton app

  const group = await prisma.saleGroup.findUnique({
    where: { id },
    include: {
      vendor: { select: { id: true, name: true, phone: true, avatar: true } },
      orders: {
        include: { product: { include: { category: true } } },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { orders: true } },
    },
  });

  if (!group) notFound();

  // Vérifie si l'utilisateur connecté est le propriétaire du groupe
  const isOwner = currentUserId ? currentUserId === group.vendorId : false;

  const currentCount = group._count.orders;
  const progress = Math.min(100, (currentCount / group.maxMembers) * 100);
  const statusInfo = GROUP_STATUS[group.status as keyof typeof GROUP_STATUS] ?? GROUP_STATUS.open;

  const products = await prisma.product.findMany({
    where: { vendorId: group.vendorId },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  const coverSrc = group.coverImage && group.coverImage.trim() !== ""
    ? group.coverImage
    : "https://images.unsplash.com/photo-1483985988355-763728e9fb55?w=1200&q=80";

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <FadeIn>
          <div className="relative h-64 md:h-80 rounded-3xl overflow-hidden mb-8 border border-white/10">
            <Image
              src={coverSrc}
              alt={group.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0118] via-[#0a0118]/40 to-transparent" />
            
            {/* Bouton de modification positionné en haut à droite de la couverture si propriétaire */}
            <div className="absolute top-6 right-6 z-10">
              <GroupHeaderActions group={group} isOwner={isOwner} />
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex gap-2 mb-3">
                <Badge variant="pink">-{group.discount}% groupé</Badge>
                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{group.title}</h1>
              {group.description && (
                <p className="text-zinc-400 mt-2 max-w-xl">{group.description}</p>
              )}
            </div>
          </div>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Info sidebar */}
          <FadeIn delay={0.1} className="md:col-span-1 space-y-4">
            <GlassCard className="p-6" hover={false}>
              <h3 className="font-semibold text-white mb-4">Informations</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3 text-zinc-400">
                  <User className="h-4 w-4 text-pink-400" />
                  <span>{group.vendor.name}</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <Users className="h-4 w-4 text-pink-400" />
                  <span>{currentCount} / {group.maxMembers} membres</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <Calendar className="h-4 w-4 text-pink-400" />
                  <span>Limite : {formatDate(group.deadline)} ({daysLeft(group.deadline)}j)</span>
                </div>
                <div className="flex items-center gap-3 text-zinc-400">
                  <Percent className="h-4 w-4 text-pink-400" />
                  <span>-{group.discount}% en commande groupée</span>
                </div>
              </div>

              <div className="mt-5">
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-500 mt-2">
                  Min. {group.minMembers} personnes pour valider la commande
                </p>
              </div>

              <div className="mt-6">
                <ShareGroupButton groupTitle={group.title} />
              </div>
            </GlassCard>

            {group.status === "open" && (
              <JoinGroupForm 
                groupId={group.id} 
                products={products} 
                discount={group.discount} 
                vendor={{ name: group.vendor.name, phone: group.vendor.phone ?? "" }} 
              />
            )}
          </FadeIn>

          {/* Orders list */}
          <FadeIn delay={0.2} className="md:col-span-2">
            <GlassCard className="p-6" hover={false}>
              <h3 className="font-semibold text-white mb-4">
                Commandes <GradientText>({group.orders.length})</GradientText>
              </h3>
              {group.orders.length === 0 ? (
                <p className="text-zinc-500 text-sm py-8 text-center">
                  Aucune commande pour le moment. Soyez la première !
                </p>
              ) : (
                <div className="space-y-3">
                  {group.orders.map((order) => {
                    const itemPrice = order.product.price * (1 - group.discount / 100);
                    return (
                      <div
                        key={order.id}
                        className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/5 p-4"
                      >
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={order.product.imageUrl}
                            alt={order.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white truncate">{order.buyerName}</p>
                          <p className="text-xs text-zinc-500 truncate">{order.product.name}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-pink-400">{formatPrice(itemPrice)}</p>
                          <div className="mt-1">
                            <Badge variant={order.status === "confirmed" ? "success" : "default"}>
                               {order.status === "confirmed" ? "Confirmé" : "En attente"}
                            </Badge>
                          </div>
                          {order.size && (
                            <p className="text-xs text-zinc-600 mt-1">Taille {order.size}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </GlassCard>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}