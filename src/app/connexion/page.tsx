"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Sparkles, Eye, EyeOff } from "lucide-react";
import { FadeIn, GradientText, GlassCard, Button } from "@/components/ui/motion";

export default function ConnexionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false); // État pour afficher/masquer le mot de passe

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
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
            Bon retour sur <GradientText>Sheela</GradientText>
          </h1>
          <p className="text-zinc-500 text-sm mt-2">Connectez-vous à votre espace vendeuse</p>
        </div>

        <GlassCard className="p-8" hover={false}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
              <input
                name="email"
                type="email"
                required
                defaultValue="demo@sheela.fr"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:outline-none focus:border-pink-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  defaultValue="demo123"
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-pink-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Se connecter
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="text-pink-400 hover:text-pink-300">
              S&apos;inscrire
            </Link>
          </p>

          <div className="mt-4 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
            <p className="text-xs text-pink-300 text-center">
              Demo : demo@sheela.fr / demo123
            </p>
          </div>
        </GlassCard>
      </FadeIn>
    </div>
  );
}