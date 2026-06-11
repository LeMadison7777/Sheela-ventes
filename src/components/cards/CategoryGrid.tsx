"use client";

import { motion } from "framer-motion";
import {
  Shirt,
  Gem,
  Sparkles,
  Footprints,
  Paintbrush,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { GlassCard } from "@/components/ui/motion";

const iconMap: Record<string, LucideIcon> = {
  Shirt,
  Gem,
  Sparkles,
  Footprints,
  Paintbrush,
};

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  color: string;
  _count?: { products: number };
};

export default function CategoryGrid({ categories }: { categories: Category[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {categories.map((cat, i) => {
        const Icon = iconMap[cat.icon] ?? Sparkles;
        return (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={`/catalogue?category=${cat.slug}`}>
              <GlassCard className="p-5 text-center cursor-pointer group">
                <div
                  className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-3"
                  style={{
                    background: `linear-gradient(135deg, ${cat.color}33, ${cat.color}11)`,
                    border: `1px solid ${cat.color}44`,
                  }}
                >
                  <Icon className="h-6 w-6" style={{ color: cat.color }} />
                </div>
                <h3 className="font-semibold text-white text-sm mb-1 group-hover:text-pink-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-2">{cat.description}</p>
                {cat._count && (
                  <p className="text-xs text-zinc-600 mt-2">{cat._count.products} articles</p>
                )}
              </GlassCard>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
