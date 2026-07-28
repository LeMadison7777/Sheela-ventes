import "dotenv/config";
import bcrypt from "bcryptjs";
import { createSeedClient } from "../src/lib/prisma";

const prisma = createSeedClient();

async function main() {
  await prisma.order.deleteMany();
  await prisma.saleGroup.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const vendor = await prisma.user.create({
    data: {
      email: "demo@sheela.fr",
      name: "Amina Shop",
      password: await bcrypt.hash("demo123", 12),
      phone: "+33 6 12 34 56 78",
      role: "vendor",
    },
  });

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Vêtements",
        slug: "vetements",
        icon: "Shirt",
        color: "#FF6B9D",
        description: "Robes, tops, ensembles & tendances",
      },
    }),
    prisma.category.create({
      data: {
        name: "Accessoires",
        slug: "accessoires",
        icon: "Gem",
        color: "#C084FC",
        description: "Sacs, bijoux, lunettes",
      },
    }),
    prisma.category.create({
      data: {
        name: "Parfums",
        slug: "parfums",
        icon: "Sparkles",
        color: "#F59E0B",
        description: "Fragrances & eaux de parfum",
      },
    }),
    prisma.category.create({
      data: {
        name: "Chaussures",
        slug: "chaussures",
        icon: "Footprints",
        color: "#34D399",
        description: "Sneakers, talons, sandales",
      },
    }),
    prisma.category.create({
      data: {
        name: "Ongles",
        slug: "ongles",
        icon: "Paintbrush",
        color: "#F472B6",
        description: "Press-on, gel, nail art",
      },
    }),
  ]);

  const [vetements, accessoires, parfums, chaussures, ongles] = categories;

  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: "Robe satinée fleurie",
        description: "Robe midi élégante, coupe fluide, parfaite pour l'été",
        price: 8000,
        imageUrl: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
        sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
        colors: JSON.stringify(["Rose", "Blanc", "Noir"]),
        featured: true,
        categoryId: vetements.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Ensemble crop top + jupe",
        description: "Set coordonné tendance, tissu stretch confortable",
        price: 7500,
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
        sizes: JSON.stringify(["S", "M", "L"]),
        colors: JSON.stringify(["Beige", "Kaki", "Noir"]),
        featured: true,
        categoryId: vetements.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Sac bandoulière chaîne dorée",
        description: "Mini sac structuré, finitions premium",
        price: 12000,
        imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
        colors: JSON.stringify(["Noir", "Blanc", "Camel"]),
        featured: true,
        categoryId: accessoires.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Boucles d'oreilles perles",
        description: "Bijoux délicats, finition dorée",
        price: 6000,
        imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
        colors: JSON.stringify(["Or", "Argent"]),
        categoryId: accessoires.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Eau de parfum Vanille Gourmande",
        description: "Notes vanille, caramel et musc blanc — 50ml",
        price: 3500,
        imageUrl: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80",
        featured: true,
        categoryId: parfums.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Sneakers plateforme blanches",
        description: "Semelle épaisse 4cm, confort toute la journée",
        price: 28000,
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80",
        sizes: JSON.stringify(["36", "37", "38", "39", "40", "41"]),
        colors: JSON.stringify(["Blanc", "Noir/Rose"]),
        featured: true,
        categoryId: chaussures.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Kit ongles press-on French",
        description: "24 capsules, colle incluse, finition salon",
        price: 10000,
        imageUrl: "https://images.unsplash.com/photo-1604654896290-d063af5b9ebd?w=600&q=80",
        colors: JSON.stringify(["French", "Nude", "Bordeaux"]),
        featured: true,
        categoryId: ongles.id,
      },
    }),
    prisma.product.create({
      data: {
        name: "Mules talons carrés",
        description: "Talons 7cm, style minimal chic",
        price: 11000,
        imageUrl: "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=600&q=80",
        sizes: JSON.stringify(["36", "37", "38", "39", "40"]),
        colors: JSON.stringify(["Noir", "Nude", "Rouge"]),
        categoryId: chaussures.id,
      },
    }),
  ]);

  const deadline1 = new Date();
  deadline1.setDate(deadline1.getDate() + 7);

  const deadline2 = new Date();
  deadline2.setDate(deadline2.getDate() + 14);

  const deadline3 = new Date();
  deadline3.setDate(deadline3.getDate() + 5);

  const groups = await Promise.all([
    prisma.saleGroup.create({
      data: {
        title: "Drop Robes Été ☀️",
        description: "Commande groupée robes & ensembles — livraison sous 3 semaines",
        coverImage: "https://i.pinimg.com/1200x/56/a5/77/56a57771227133ce5e1ff4c22b3ca830.jpg",
        minMembers: 5,
        maxMembers: 30,
        discount: 15,
        deadline: deadline1,
        vendorId: vendor.id,
      },
    }),
    prisma.saleGroup.create({
      data: {
        title: "Pack Beauté & Parfums 💄",
        description: "Parfums + ongles press-on à prix groupé",
        coverImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
        minMembers: 8,
        maxMembers: 40,
        discount: 20,
        deadline: deadline2,
        vendorId: vendor.id,
      },
    }),
    prisma.saleGroup.create({
      data: {
        title: "Sneakers & Accessoires 🔥",
        description: "Dernières tendances chaussures + sacs",
        coverImage: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80",
        minMembers: 6,
        maxMembers: 25,
        discount: 12,
        deadline: deadline3,
        vendorId: vendor.id,
      },
    }),
  ]);

  const buyers = [
    { name: "Sarah M.", phone: "06 11 22 33 44" },
    { name: "Léa D.", phone: "06 55 66 77 88" },
    { name: "Fatou B.", phone: "06 99 88 77 66" },
    { name: "Chloé R.", phone: "06 44 33 22 11" },
    { name: "Inès K.", phone: "06 77 88 99 00" },
    { name: "Maya T.", phone: "06 12 98 76 54" },
    { name: "Jade P.", phone: "06 33 44 55 66" },
  ];

  for (let i = 0; i < buyers.length; i++) {
    await prisma.order.create({
      data: {
        productId: products[i % products.length].id,
        groupId: groups[i % groups.length].id,
        buyerName: buyers[i].name,
        buyerPhone: buyers[i].phone,
        quantity: 1,
        size: "M",
        status: i < 3 ? "confirmed" : "pending",
      },
    });
  }

  for (const group of groups) {
    const count = await prisma.order.count({ where: { groupId: group.id } });
    await prisma.saleGroup.update({
      where: { id: group.id },
      data: { currentCount: count },
    });
  }

  console.log("✅ Seed terminé !");
  console.log("   Compte demo: demo@sheela.fr / demo123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
