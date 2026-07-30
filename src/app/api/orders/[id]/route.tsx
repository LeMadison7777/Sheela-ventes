// src/app/api/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(req: Request, { params }: Params) {
  try {
    const { id } = await params;

    // Supprimer la commande de la base de données
    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Commande annulée" });
  } catch (error) {
    console.error("Erreur DELETE order:", error);
    return NextResponse.json(
      { error: "Impossible d'annuler la commande" },
      { status: 500 }
    );
  }
}