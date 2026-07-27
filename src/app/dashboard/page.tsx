"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  Plus,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { FadeIn, GradientText, GlassCard, Badge } from "@/components/ui/motion";
import { formatDate } from "@/lib/utils";

type DashboardData = {
  userRole?: string; // ⬅️ Ajout du rôle de l'utilisateur ici
  stats: { groups: number; orders: number; products: number; categories: number };
  recentGroups: Array<{
    id: string;
    title: string;
    status: string;
    currentCount: number;
    maxMembers: number;
    deadline: string;
  }>;
  recentOrders: Array<{
    id: string;
    buyerName: string;
    status: string;
    product: { name: string };
    group: { title: string };
  }>;
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => {
        if (r.status === 401) {
          router.push("/connexion");
          return null;
        }
        return r.json();
      })
      .then((d) => {
        if (d) setData(d);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-pink-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!data) return null;

  const statCards = [
    { icon: ShoppingBag, label: "Mes groupes", value: data.stats.groups, color: "text-pink-400" },
    { icon: Users, label: "Commandes reçues", value: data.stats.orders, color: "text-violet-400" },
    { icon: Package, label: "Articles catalogue", value: data.stats.products, color: "text-amber-400" },
    { icon: TrendingUp, label: "Catégories", value: data.stats.categories, color: "text-emerald-400" },
  ];

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="mx-auto max-w-7xl">
        <FadeIn className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1">
              Mon <GradientText>Dashboard</GradientText>
            </h1>
            <p className="text-zinc-500">Gérez vos ventes groupées en un coup d&apos;œil</p>
          </div>
          <Link
            href="/groupes/creer"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 hover:scale-105 transition-transform"
          >
            <Plus className="h-4 w-4" />
            Nouveau groupe
          </Link>
        </FadeIn>

        {/* ⚡ SECTION SUPER ADMIN ⚡ */}
        {data.userRole === "ADMIN" && (
          <FadeIn delay={0.05}>
            <GlassCard className="p-6 mb-10 border-purple-500/50 bg-purple-900/10" hover={false}>
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="h-6 w-6 text-purple-400" />
                <h2 className="text-xl font-bold text-purple-400">Espace Super Admin</h2>
              </div>
              <p className="text-zinc-400 text-sm mb-5">
                Vous avez les droits d'administration sur l'ensemble de la plateforme.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 rounded-lg text-white text-sm font-medium transition-colors">
                  Gérer tous les utilisateurs
                </button>
                <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-white text-sm font-medium transition-colors">
                  Modérer les groupes
                </button>
              </div>
            </GlassCard>
          </FadeIn>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map((stat, i) => (
            <FadeIn key={stat.label} delay={i * 0.08}>
              <GlassCard className="p-5" hover={false}>
                <stat.icon className={`h-5 w-5 ${stat.color} mb-3`} />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-3xl font-bold text-white"
                >
                  {stat.value}
                </motion.div>
                <p className="text-xs text-zinc-500 mt-1">{stat.label}</p>
              </GlassCard>
            </FadeIn>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Groups */}
          <FadeIn delay={0.2}>
            <GlassCard className="p-6" hover={false}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-white">Mes groupes récents</h2>
                <Link href="/groupes" className="text-xs text-pink-400 flex items-center gap-1 hover:text-pink-300">
                  Voir tout <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              {data.recentGroups.length === 0 ? (
                <p className="text-sm text-zinc-500 py-6 text-center">Aucun groupe créé</p>
              ) : (
                <div className="space-y-3">
                  {data.recentGroups.map((group) => (
                    <Link
                      key={group.id}
                      href={`/groupes/${group.id}`}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4 hover:bg-white/10 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{group.title}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {group.currentCount}/{group.maxMembers} · Limite {formatDate(group.deadline)}
                        </p>
                      </div>
                      <Badge variant={group.status === "open" ? "success" : "default"}>
                        {group.status === "open" ? "Ouvert" : group.status}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </GlassCard>
          </FadeIn>

          {/* Recent Orders */}
          <FadeIn delay={0.3}>
            <GlassCard className="p-6" hover={false}>
              <h2 className="font-semibold text-white mb-5">Dernières commandes</h2>
              {data.recentOrders.length === 0 ? (
                <p className="text-sm text-zinc-500 py-6 text-center">Aucune commande</p>
              ) : (
                <div className="space-y-3">
                  {data.recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 p-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{order.buyerName}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">
                          {order.product.name} · {order.group.title}
                        </p>
                      </div>
                      <Badge variant={order.status === "confirmed" ? "success" : "default"}>
                        {order.status === "confirmed" ? "Confirmé" : "En attente"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}