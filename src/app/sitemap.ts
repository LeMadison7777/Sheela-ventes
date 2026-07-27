import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Remplace par l'URL de ton site en production (ou utilise une variable d'environnement)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sheela-ventes.com";

  // Pages statiques de ton application
  const staticPages = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/groupes`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    },
  ];

  // (Optionnel) Si tu veux plus tard inclure tes groupes ou produits dynamiquement depuis Prisma :
  /*
  const groups = await prisma.group.findMany();
  const groupPages = groups.map((group) => ({
    url: `${baseUrl}/groupes/${group.id}`,
    lastModified: group.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));
  */

  return [...staticPages];
}