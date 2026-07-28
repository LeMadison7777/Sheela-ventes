"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { GlassCard, Badge } from "@/components/ui/motion";
import { formatPrice } from "@/lib/utils";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string;
  featured: boolean;
  category: { name: string; color: string };
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/catalogue?product=${product.id}`}>
      <GlassCard className="overflow-hidden group cursor-pointer h-full">
        <div className="relative h-56 overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0118]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {product.featured && (
            <div className="absolute top-3 left-3">
              <Badge variant="warning">Tendance</Badge>
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <span
              className="inline-block rounded-full px-3 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: product.category.color + "CC" }}
            >
              {product.category.name}
            </span>
          </motion.div>
        </div>

        <div className="p-4">
          <h3 className="font-medium text-white mb-1 group-hover:text-pink-300 transition-colors line-clamp-1">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-zinc-500 line-clamp-2 mb-3">{product.description}</p>
          )}
          <div className="flex items-center justify-between">
           <span className="font-bold text-white">{formatPrice(product.price)}</span>
            <span className="text-xs text-zinc-500">{product.category.name}</span>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
