"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ShoppingBag, CheckCircle2 } from "lucide-react";
import { GlassCard, Button } from "@/components/ui/motion";
import { formatPrice, parseJsonArray } from "@/lib/utils";
import MobileMoneyInstructions from "@/components/groups/MobileMoneyInstructions";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  sizes: string;
  colors: string;
  category: { name: string };
};

type Vendor = {
  name: string;
  phone: string;
};

export default function JoinGroupForm({
  groupId,
  products,
  discount,
  vendor,
}: {
  groupId: string;
  products: Product[];
  discount: number;
  vendor: Vendor;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id ?? "");

  const product = products.find((p) => p.id === selectedProduct);
  const sizes = product ? parseJsonArray(product.sizes) : [];
  const colors = product ? parseJsonArray(product.colors) : [];
  const discountedPrice = product ? product.price * (1 - discount / 100) : 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch(`/api/groups/${groupId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct,
          buyerName: form.get("buyerName"),
          buyerPhone: form.get("buyerPhone"),
          buyerEmail: form.get("buyerEmail") || undefined,
          size: form.get("size") || undefined,
          color: form.get("color") || undefined,
          notes: form.get("notes") || undefined,
          quantity: 1,
          botField: form.get("botField"), // Sécurité anti-spam
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Erreur");

      setSuccess(true);
      router.refresh();
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur lors de la commande");
    } finally {
      setLoading(false);
    }
  }

  return (
    <GlassCard className="p-6" hover={false}>
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag className="h-5 w-5 text-pink-400" />
        <h3 className="font-semibold text-white">Rejoindre le groupe</h3>
      </div>

      {success ? (
        <div className="py-8 text-center space-y-3">
          <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-400 rounded-full">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h4 className="font-medium text-white">Commande enregistrée !</h4>
          <p className="text-xs text-zinc-400">
            Pensez à effectuer le paiement Mobile Money selon les instructions ci-dessous pour valider votre participation.
          </p>
          <button
            type="button"
            onClick={() => setSuccess(false)}
            className="mt-4 text-xs text-pink-400 hover:underline cursor-pointer"
          >
            Faire une autre commande
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Champ piège anti-spam (Honeypot) */}
          <div style={{ display: "none" }} aria-hidden="true">
            <input
              type="text"
              name="botField"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Article *</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500/50"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#1a0a2e]">
                  {p.name} — {formatPrice(p.price)}
                </option>
              ))}
            </select>
            {product && (
              <p className="text-xs text-pink-400 mt-1.5">
                Prix groupé : {formatPrice(discountedPrice)} (-{discount}%)
              </p>
            )}
          </div>

          {sizes.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Taille</label>
              <select name="size" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500/50">
                {sizes.map((s) => (
                  <option key={s} value={s} className="bg-[#1a0a2e]">{s}</option>
                ))}
              </select>
            </div>
          )}

          {colors.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Couleur</label>
              <select name="color" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500/50">
                {colors.map((c) => (
                  <option key={c} value={c} className="bg-[#1a0a2e]">{c}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Votre nom *</label>
            <input
              name="buyerName"
              required
              placeholder="Prénom Nom"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Téléphone *</label>
            <input
              name="buyerPhone"
              required
              placeholder="06 12 34 56 78"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email (optionnel)</label>
            <input
              name="buyerEmail"
              type="email"
              placeholder="email@exemple.com"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Notes</label>
            <textarea
              name="notes"
              rows={2}
              placeholder="Instructions spéciales..."
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-pink-500/50 resize-none"
            />
          </div>

          {/* Encadré Mobile Money intégré */}
          <MobileMoneyInstructions vendorName={vendor.name} vendorPhone={vendor.phone} />

          {error && <p className="text-xs text-red-400">{error}</p>}

          <Button type="submit" disabled={loading || !selectedProduct} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Commander
          </Button>
        </form>
      )}
    </GlassCard>
  );
}