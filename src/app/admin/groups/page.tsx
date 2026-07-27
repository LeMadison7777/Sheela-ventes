"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2, Power } from "lucide-react";
import { FadeIn, GradientText, GlassCard, Badge } from "@/components/ui/motion";
import { formatDate } from "@/lib/utils";

type GroupType = {
  id: string;
  title: string;
  status: string;
  maxMembers: number;
  deadline: string;
  createdAt: string;
  vendor: { name: string | null; email: string };
  _count: { orders: number };
};

export default function AdminGroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<GroupType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/groups")
      .then(async (r) => {
        if (r.status === 401 || r.status === 403) {
          router.push("/dashboard");
          return null;
        }
        const text = await r.text();
        if (!text) return null;
        return JSON.parse(text);
      })
      .then((data) => {
        if (data) setGroups(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  // Fonction pour ouvrir ou fermer un groupe
  const toggleGroupStatus = async (groupId: string, currentStatus: string) => {
    const newStatus = currentStatus === "open" ? "closed" : "open";

    const res = await fetch("/api/admin/groups", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, status: newStatus }),
    });

    if (res.ok) {
      setGroups(groups.map((g) => (g.id === groupId ? { ...g, status: newStatus } : g)));
    }
  };

  // Fonction pour supprimer un groupe
  const deleteGroup = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce groupe ?")) return;

    const res = await fetch(`/api/admin/groups?id=${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setGroups(groups.filter((g) => g.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="mx-auto max-w-6xl">
        <FadeIn className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-1">
            Modération des <GradientText>Groupes</GradientText>
          </h1>
          <p className="text-zinc-500">Gérez l'ensemble des groupes de vente de la plateforme</p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <GlassCard className="p-6" hover={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-zinc-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Groupe</th>
                    <th className="py-3 px-4">Créateur (Vendeur)</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Commandes</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {groups.map((g) => (
                    <tr key={g.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4">
                        <p className="font-medium text-white">{g.title}</p>
                        <p className="text-xs text-zinc-500">Créé le {formatDate(g.createdAt)}</p>
                      </td>
                      <td className="py-4 px-4 text-zinc-300">
                        <p className="font-medium">{g.vendor?.name || "Anonyme"}</p>
                        <p className="text-xs text-zinc-500">{g.vendor?.email}</p>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={g.status === "open" ? "success" : "default"}>
                          {g.status === "open" ? "Ouvert" : "Fermé"}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-zinc-300">
                        {g._count.orders} commande(s)
                      </td>
                      <td className="py-4 px-4 text-right space-x-2">
                        {/* Bouton pour Ouvrir / Fermer */}
                        <button
                          onClick={() => toggleGroupStatus(g.id, g.status)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white inline-flex items-center gap-1.5"
                          title="Changer le statut"
                        >
                          <Power className="h-3.5 w-3.5 text-zinc-400" />
                          {g.status === "open" ? "Fermer" : "Ouvrir"}
                        </button>

                        {/* Bouton pour Supprimer */}
                        <button
                          onClick={() => deleteGroup(g.id)}
                          className="p-2 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 hover:bg-red-500/20 transition-colors inline-flex items-center justify-center align-middle"
                          title="Supprimer le groupe"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {groups.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-zinc-500">
                        Aucun groupe trouvé.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </FadeIn>
      </div>
    </div>
  );
}