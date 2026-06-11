"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { GlassCard, Badge } from "@/components/ui/motion";
import { cn, daysLeft } from "@/lib/utils";
import { GROUP_STATUS } from "@/lib/constants";

type Group = {
  id: string;
  title: string;
  description: string | null;
  coverImage: string | null;
  minMembers: number;
  maxMembers: number;
  currentCount: number;
  discount: number;
  deadline: string | Date;
  status: string;
  vendor: { name: string; avatar: string | null };
};

export default function GroupCard({ group }: { group: Group }) {
  const progress = Math.min(100, (group.currentCount / group.maxMembers) * 100);
  const statusInfo = GROUP_STATUS[group.status as keyof typeof GROUP_STATUS] ?? GROUP_STATUS.open;

  return (
    <Link href={`/groupes/${group.id}`}>
      <GlassCard className="overflow-hidden group cursor-pointer h-full">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={group.coverImage ?? "https://images.unsplash.com/photo-1483985988355-763728e9fb55?w=600&q=80"}
            alt={group.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0118] via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant="pink">-{group.discount}%</Badge>
            <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium text-white", statusInfo.color)}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-white mb-1 group-hover:text-pink-300 transition-colors">
            {group.title}
          </h3>
          <p className="text-xs text-zinc-500 mb-3">par {group.vendor.name}</p>
          {group.description && (
            <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{group.description}</p>
          )}

          <div className="mb-3">
            <div className="flex justify-between text-xs text-zinc-500 mb-1.5">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {group.currentCount}/{group.maxMembers}
              </span>
              <span>{daysLeft(group.deadline)}j restants</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${progress}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-pink-500 to-violet-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Min. {group.minMembers} personnes</span>
            <span className="flex items-center gap-1 text-sm text-pink-400 font-medium">
              Rejoindre <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
