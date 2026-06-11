import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  const groups = await prisma.saleGroup.findMany({
    where: status ? { status } : undefined,
    include: {
      vendor: { select: { id: true, name: true, avatar: true } },
      orders: { select: { id: true } },
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const enriched = groups.map((g) => ({
    ...g,
    currentCount: g._count.orders,
  }));

  return NextResponse.json(enriched);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const group = await prisma.saleGroup.create({
      data: {
        title: body.title,
        description: body.description,
        coverImage: body.coverImage,
        minMembers: body.minMembers ?? 5,
        maxMembers: body.maxMembers ?? 50,
        discount: body.discount ?? 10,
        deadline: new Date(body.deadline),
        vendorId: body.vendorId,
      },
      include: {
        vendor: { select: { id: true, name: true, avatar: true } },
      },
    });
    return NextResponse.json(group, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur création groupe" }, { status: 400 });
  }
}
