"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
}

interface AddProductModalProps {
  vendorId: string;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({ vendorId, categories, isOpen, onClose }: AddProductModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    categoryId: categories[0]?.id || "",
    imageUrl: "",
  });

  if (!isOpen) return null;

  // Gestion de la sélection de fichier (Galerie / Caméra du téléphone)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Génère une URL locale temporaire pour l'aperçu et l'enregistrement
      const objectUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, imageUrl: objectUrl }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          vendorId,
        }),
      });

      if (!res.ok) throw new Error("Erreur lors de la création du produit");

      router.refresh();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de l'ajout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 text-white shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Ajouter un article à ma galerie</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Nom de l'article</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-500"
              placeholder="Ex: Robe de soirée élégante"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Prix (en FCFA)</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-500"
              placeholder="Ex: 15000"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Catégorie</label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-500"
              required
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-zinc-900">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sélection Galerie / Caméra ou URL */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Image de l'article</label>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="w-full text-sm text-zinc-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-pink-500/10 file:text-pink-400 hover:file:bg-pink-500/20 cursor-pointer bg-zinc-800 border border-white/10 rounded-xl"
              />
              <input
                type="text"
                placeholder="Ou coller une URL d'image (ex: Unsplash)"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition text-sm"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium hover:opacity-90 transition text-sm disabled:opacity-50"
            >
              {loading ? "Ajout en cours..." : "Enregistrer l'article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}