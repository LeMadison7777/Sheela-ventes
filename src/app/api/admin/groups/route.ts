import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET : Récupérer tous les groupes de la plateforme avec leurs créateurs
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }

  const groups = await prisma.saleGroup.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      vendor: { select: { name: true, email: true } },
      _count: { select: { orders: true } },
    },
  });

  return NextResponse.json(groups);
}

// PATCH : Modifier le statut d'un groupe (ex: ouvrir ou fermer)
export async function PATCH(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { groupId, status } = body;

    const updatedGroup = await prisma.saleGroup.update({
      where: { id: groupId },
      data: { status },
    });

    return NextResponse.json(updatedGroup);
  } catch {
    return NextResponse.json({ error: "Erreur lors de la mise à jour du statut" }, { status: 500 });
  }
}

// DELETE : Supprimer un groupe inapproprié ou obsolète
export async function DELETE(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
  if (dbUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès non autorisé" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    await prisma.saleGroup.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}