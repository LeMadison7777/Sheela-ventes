import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Utilise bien l'URL de ton site en production
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sheela-ventes.vercel.app";

  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    // Ajoute ici tes autres pages si tu en as (ex: /groupes, etc.)
    // {
    //   url: `${baseUrl}/groupes`,
    //   lastModified: new Date(),
    //   changeFrequency: "weekly",
    //   priority: 0.8,
    // },
  ];
}