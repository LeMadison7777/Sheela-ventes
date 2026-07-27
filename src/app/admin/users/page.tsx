"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Shield, User, Mail, Calendar } from "lucide-react";
import { FadeIn, GradientText, GlassCard, Badge } from "@/components/ui/motion";
import { formatDate } from "@/lib/utils";

type UserType = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);

  
  // Charger les utilisateurs (Version sécurisée)
  useEffect(() => {
    fetch("/api/admin/users")
      .then(async (r) => {
        if (r.status === 401 || r.status === 403) {
          router.push("/dashboard");
          return null;
        }
        
        // On lit le texte brut d'abord
        const text = await r.text();
        
        // Si le texte est vide (le fameux "Unexpected end of JSON"), on annule
        if (!text) return null; 
        
        // Sinon, on le transforme en JSON en toute sécurité
        return JSON.parse(text);
      })
      .then((data) => {
        if (data) setUsers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erreur de récupération des utilisateurs :", error);
        setLoading(false);
      });
  }, [router]);
  // Changer le rôle d'un utilisateur
  const toggleRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    });

    if (res.ok) {
      setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
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
        
        {/* En-tête */}
        <FadeIn className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Retour au dashboard
          </Link>
          <h1 className="text-3xl font-bold mb-1">
            Gestion des <GradientText>Utilisateurs</GradientText>
          </h1>
          <p className="text-zinc-500">Liste de tous les membres inscrits sur Sheela</p>
        </FadeIn>

        {/* Tableau des utilisateurs */}
        <FadeIn delay={0.1}>
          <GlassCard className="p-6" hover={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-zinc-400 uppercase tracking-wider">
                    <th className="py-3 px-4">Utilisateur</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Rôle actuel</th>
                    <th className="py-3 px-4">Inscription</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                          {u.role === "ADMIN" ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                        </div>
                        <span className="font-medium text-white">{u.name || "Sans nom"}</span>
                      </td>
                      <td className="py-4 px-4 text-zinc-400 flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5" /> {u.email}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={u.role === "ADMIN" ? "success" : "default"}>
                          {u.role}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-zinc-500 text-xs flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" /> {formatDate(u.createdAt)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => toggleRole(u.id, u.role)}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 bg-white/5 hover:bg-white/10 transition-colors text-white"
                        >
                          {u.role === "ADMIN" ? "Rétrograder User" : "Passer Admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </FadeIn>
      </div>
    </div>
  );
}