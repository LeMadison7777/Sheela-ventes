import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // 1. On récupère ton profil depuis la base de données pour avoir ton statut ADMIN en direct
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  const [groups, orders, products, categories] = await Promise.all([
    prisma.saleGroup.count({ where: { vendorId: user.id } }),
    prisma.order.count({
      where: { group: { vendorId: user.id } },
    }),
    prisma.product.count(),
    prisma.category.count(),
  ]);

  const recentGroups = await prisma.saleGroup.findMany({
    where: { vendorId: user.id },
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const recentOrders = await prisma.order.findMany({
    where: { group: { vendorId: user.id } },
    include: {
      product: true,
      group: { select: { title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return NextResponse.json({
    userRole: dbUser?.role, // ⬇️ 2. La pièce manquante : on envoie le rôle au Dashboard
    stats: { groups, orders, products, categories },
    recentGroups: recentGroups.map((g) => ({
      ...g,
      currentCount: g._count.orders,
    })),
    recentOrders,
  });
}