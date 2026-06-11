"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { FadeIn, GradientText, Button, GlassCard } from "@/components/ui/motion";

type Product = { id: string; name: string; price: number; category: { name: string } };

export default function CreerGroupePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) router.push("/connexion");
        else setUserId(d.user.id);
      });
    fetch("/api/products")
      .then((r) => r.json())
      .then(setProducts);
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!userId) return;
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          description: form.get("description"),
          coverImage: form.get("coverImage") || undefined,
          minMembers: Number(form.get("minMembers")),
          maxMembers: Number(form.get("maxMembers")),
          discount: Number(form.get("discount")),
          deadline: form.get("deadline"),
          vendorId: userId,
        }),
      });

      if (!res.ok) throw new Error("Erreur");
      const group = await res.json();
      router.push(`/groupes/${group.id}`);
    } catch {
      setError("Impossible de créer le groupe. Vérifiez vos informations.");
    } finally {
      setLoading(false);
    }
  }

  const defaultDeadline = new Date();
  defaultDeadline.setDate(defaultDeadline.getDate() + 14);

  return (
    <div className="min-h-screen pt-28 pb-20 px-6">
      <div className="mx-auto max-w-2xl">
        <FadeIn>
          <Link href="/groupes" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-pink-400 mb-6">
            <ArrowLeft className="h-4 w-4" /> Retour aux groupes
          </Link>
          <h1 className="text-3xl font-bold mb-2">
            Créer un <GradientText>groupe de vente</GradientText>
          </h1>
          <p className="text-zinc-500 mb-8">
            Configurez votre commande groupée et invitez vos clientes
          </p>
        </FadeIn>

        <FadeIn delay={0.1}>
          <GlassCard className="p-8" hover={false}>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Titre du groupe *</label>
                <input
                  name="title"
                  required
                  placeholder="Ex: Drop Robes Été ☀️"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Décrivez votre commande groupée..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Image de couverture (URL)</label>
                <input
                  name="coverImage"
                  type="url"
                  placeholder="https://..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Min. membres</label>
                  <input
                    name="minMembers"
                    type="number"
                    defaultValue={5}
                    min={2}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Max. membres</label>
                  <input
                    name="maxMembers"
                    type="number"
                    defaultValue={30}
                    min={5}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Réduction (%)</label>
                  <input
                    name="discount"
                    type="number"
                    defaultValue={15}
                    min={0}
                    max={50}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">Date limite *</label>
                  <input
                    name="deadline"
                    type="date"
                    required
                    defaultValue={defaultDeadline.toISOString().split("T")[0]}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500/50"
                  />
                </div>
              </div>

              {products.length > 0 && (
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-zinc-400 mb-2">
                    {products.length} articles disponibles dans le catalogue
                  </p>
                  <p className="text-xs text-zinc-600">
                    Vos clientes pourront choisir parmi ces articles lors de leur commande
                  </p>
                </div>
              )}

              {error && <p className="text-sm text-red-400">{error}</p>}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Création..." : "Créer le groupe"}
              </Button>
            </form>
          </GlassCard>
        </FadeIn>
      </div>
    </div>
  );
}
