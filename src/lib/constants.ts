export const CATEGORIES = [
  {
    name: "Vêtements",
    slug: "vetements",
    icon: "Shirt",
    color: "#FF6B9D",
    description: "Robes, tops, ensembles & tendances Shein",
  },
  {
    name: "Accessoires",
    slug: "accessoires",
    icon: "Gem",
    color: "#C084FC",
    description: "Sacs, bijoux, lunettes & plus",
  },
  {
    name: "Parfums",
    slug: "parfums",
    icon: "Sparkles",
    color: "#F59E0B",
    description: "Fragrances & eaux de parfum",
  },
  {
    name: "Chaussures",
    slug: "chaussures",
    icon: "Footprints",
    color: "#34D399",
    description: "Sneakers, talons, sandales",
  },
  {
    name: "Ongles",
    slug: "ongles",
    icon: "Paintbrush",
    color: "#F472B6",
    description: "Press-on, gel, nail art",
  },
] as const;

export const GROUP_STATUS = {
  open: { label: "Ouvert", color: "bg-emerald-500" },
  full: { label: "Complet", color: "bg-amber-500" },
  closed: { label: "Clôturé", color: "bg-zinc-500" },
  shipped: { label: "Expédié", color: "bg-violet-500" },
} as const;
