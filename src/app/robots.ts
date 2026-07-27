import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://sheela-ventes.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"], // Bloque l'accès aux routes privées/API
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}