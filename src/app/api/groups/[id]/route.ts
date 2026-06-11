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
  const { id } = await params;
  const body = await request.json();

  const group = await prisma.saleGroup.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(group);
}
