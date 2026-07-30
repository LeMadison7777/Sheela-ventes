import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;

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

  if (!group) {
    return NextResponse.json({ error: "Groupe introuvable" }, { status: 404 });
  }

  return NextResponse.json({
    ...group,
    currentCount: group._count.orders,
  });
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const group = await prisma.saleGroup.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        coverImage: body.coverImage,
        minMembers: body.minMembers ? Number(body.minMembers) : undefined,
        maxMembers: body.maxMembers ? Number(body.maxMembers) : undefined,
        discount: body.discount ? Number(body.discount) : undefined,
        deadline: body.deadline ? new Date(body.deadline) : undefined,
        status: body.status,
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.error("Erreur modification groupe:", error);
    return NextResponse.json({ error: "Impossible de modifier le groupe" }, { status: 400 });
  }
}
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { id } = await params;

    // Supprime le groupe (Assure-toi d'avoir configuré onDelete: Cascade dans ton schema.prisma 
    // pour les ordres liés, ou supprime-les d'abord si nécessaire)
    await prisma.saleGroup.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression groupe:", error);
    return NextResponse.json({ error: "Impossible de supprimer le groupe" }, { status: 400 });
  }
}
