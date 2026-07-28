import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, { params }: Params) {
  const { id: groupId } = await params;

  try {
    const body = await request.json();

    // --- SÉCURITÉ ANTI-SPAM (Honeypot) ---
    // Si le champ caché "botField" a été rempli, c'est un bot automatisé.
    // On simule un succès pour ne pas éveiller ses soupçons, mais on bloque l'écriture en base.
    if (body.botField) {
      return NextResponse.json({ success: true }, { status: 200 });
    }
    // -------------------------------------

    const group = await prisma.saleGroup.findUnique({
      where: { id: groupId },
      include: { _count: { select: { orders: true } } },
    });

    if (!group) {
      return NextResponse.json({ error: "Groupe introuvable" }, { status: 404 });
    }

    if (group.status !== "open") {
      return NextResponse.json({ error: "Ce groupe n'est plus ouvert" }, { status: 400 });
    }

    if (group._count.orders >= group.maxMembers) {
      await prisma.saleGroup.update({
        where: { id: groupId },
        data: { status: "full" },
      });
      return NextResponse.json({ error: "Groupe complet" }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        productId: body.productId,
        groupId,
        quantity: body.quantity ?? 1,
        size: body.size,
        color: body.color,
        buyerName: body.buyerName,
        buyerPhone: body.buyerPhone,
        buyerEmail: body.buyerEmail,
        notes: body.notes,
        userId: body.userId,
      },
      include: { product: true },
    });

    const count = group._count.orders + 1;
    const updates: Record<string, unknown> = { currentCount: count };

    if (count >= group.maxMembers) {
      updates.status = "full";
    } else if (count >= group.minMembers && group.status === "open") {
      updates.status = "open";
    }

    await prisma.saleGroup.update({
      where: { id: groupId },
      data: updates,
    });

    return NextResponse.json(order, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur lors de la commande" }, { status: 400 });
  }
}