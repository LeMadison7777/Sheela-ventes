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
        name: "Dentelle satinée florale 3D - Rose clair",
        description: " Dentelle résille brodée florale 3D avec paillettes",
        price: 8000,
        imageUrl: "https://i.pinimg.com/1200x/ae/23/8d/ae238d3d0816bdf0f2e1f67366a6decb.jpg",
        sizes: JSON.stringify(["XS", "S", "M", "L", "XL"]),
        colors: JSON.stringify(["Rose", "Blanc", "Noir"]),
        featured: true,
        categoryId: vetements.id,
        vendorId: vendor.id, // 👈 Ajouté ici
      },
    }),
    prisma.product.create({
      data: {
        name: "Ensemble crop top",
        description: "Chic choc tendances, tissu confortable",
        price: 7500,
        imageUrl: "https://i.pinimg.com/1200x/a7/37/2e/a7372ec7f92d500773666a4ed4085c65.jpg",
        sizes: JSON.stringify(["S", "M", "L"]),
        colors: JSON.stringify(["Beige", "Kaki", "Noir"]),
        featured: true,
        categoryId: vetements.id,
        vendorId: vendor.id, // 👈 Ajouté ici
      },
    }),
    prisma.product.create({
      data: {
        name: "Pochette de soirée de luxe ornée de cristaux dorés",
        description: "Sac à main de mariage en strass, finitions premium",
        price: 12000,
        imageUrl: "https://i.pinimg.com/1200x/54/d3/23/54d3234ca9486929a2ebbccd57503ef6.jpg",
        colors: JSON.stringify(["Noir", "Blanc", "Camel"]),
        featured: true,
        categoryId: accessoires.id,
        vendorId: vendor.id, // 👈 Ajouté ici
      },
    }),
    prisma.product.create({
      data: {
        name: "Boucles d'oreilles perles",
        description: "Bijoux délicats, finition dorée,fleuris",
        price: 6000,
        imageUrl: "https://i.pinimg.com/736x/00/5e/3f/005e3fab4761b60dcd6517b66fae50cd.jpg",
        colors: JSON.stringify(["Or", "Argent"]),
        categoryId: accessoires.id,
        vendorId: vendor.id, // 👈 Ajouté ici
      },
    }),
    prisma.product.create({
      data: {
        name: "Eau de parfum Vanille Gourmande",
        description: "Un parfum à la vanille chaude, comestible… et totalement irrésistible",
        price: 3500,
        imageUrl: "https://i.pinimg.com/1200x/d1/c0/5e/d1c05eb5ec2e41353f4fad9feeeb5ca2.jpg",
        featured: true,
        categoryId: parfums.id,
        vendorId: vendor.id, // 👈 Ajouté ici
      },
    }),
    prisma.product.create({
      data: {
        name: "Sneakers plateforme blanches",
        description: "Semelle épaisse 4cm, confort toute la journée",
        price: 28000,
        imageUrl: "https://i.pinimg.com/736x/5d/7b/30/5d7b30bce3e40f26bdc0709ab1ae55cd.jpg",
        sizes: JSON.stringify(["36", "37", "38", "39", "40", "41"]),
        colors: JSON.stringify(["Blanc", "Noir/Rose"]),
        featured: true,
        categoryId: chaussures.id,
        vendorId: vendor.id, // 👈 Ajouté ici
      },
    }),
    prisma.product.create({
      data: {
        name: "Kit ongles press-on French",
        description: "24 capsules, colle incluse, finition salon",
        price: 10000,
        imageUrl: "https://i.pinimg.com/1200x/29/1f/15/291f15a77beebc38613d473f0fcf6b8f.jpg",
        colors: JSON.stringify(["French", "Nude", "Bordeaux"]),
        featured: true,
        categoryId: ongles.id,
        vendorId: vendor.id, // 👈 Ajouté ici
      },
    }),
    prisma.product.create({
      data: {
        name: "Sandales à talons hauts élégantes pour femmes",
        description: "style de talon confortable pour les fêtes",
        price: 11000,
        imageUrl: "https://i.pinimg.com/1200x/81/f2/9f/81f29f1a713e07b59092cbcaaa1576e4.jpg",
        sizes: JSON.stringify(["36", "37", "38", "39", "40"]),
        colors: JSON.stringify(["Noir", "Nude", "Rouge"]),
        categoryId: chaussures.id,
        vendorId: vendor.id, // 👈 Ajouté ici
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
        coverImage: "https://i.pinimg.com/736x/7d/f8/49/7df849b6b49fa6d08baf8293be84b15b.jpg",
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
        coverImage: "https://i.pinimg.com/736x/90/34/14/9034145b50130541ce917b936ffd0420.jpg",
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