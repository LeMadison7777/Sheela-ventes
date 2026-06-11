"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Sparkles } from "lucide-react";
import { FadeIn, GradientText, GlassCard, Button } from "@/components/ui/motion";

export default function InscriptionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          password: form.get("password"),
          phone: form.get("phone") || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inscription");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 pt-20 gradient-mesh">
      <FadeIn className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 to-violet-600 mb-4 shadow-lg shadow-pink-500/30">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">
            Rejoignez <GradientText>Sheela</GradientText>
          </h1>
          <p className="text-zinc-500 text-sm mt-2">Créez votre espace vendeuse gratuitement</p>
        </div>

        <GlassCard className="p-8" hover={false}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Nom / Pseudo *</label>
              <input
                name="name"
                required
                placeholder="Amina Shop"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Email *</label>
              <input
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Téléphone</label>
              <input
                name="phone"
                placeholder="06 12 34 56 78"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Mot de passe *</label>
              <input
                name="password"
                type="password"
                required
                minLength={6}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500/50"
              />
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Créer mon compte
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Déjà inscrite ?{" "}
            <Link href="/connexion" className="text-pink-400 hover:text-pink-300">
              Se connecter
            </Link>
          </p>
        </GlassCard>
      </FadeIn>
    </div>
  );
}
