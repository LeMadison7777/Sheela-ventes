"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditGroupModalProps {
  group: {
    id: string;
    title: string;
    description: string | null;
    coverImage: string | null;
    discount: number;
    minMembers: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export default function EditGroupModal({ group, isOpen, onClose }: EditGroupModalProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: group.title,
    description: group.description || "",
    coverImage: group.coverImage || "",
    discount: group.discount,
    minMembers: group.minMembers,
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/groups/${group.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      router.refresh(); 
      onClose();
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour supprimer le groupe
  const handleDelete = async () => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer définitivement ce groupe ?")) return;

    try {
      const res = await fetch(`/api/groups/${group.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erreur lors de la suppression");

      router.push("/groups"); // Redirige vers la liste des groupes après suppression
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer le groupe");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg p-6 text-white shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Modifier le groupe</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-white text-xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Titre du groupe</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">URL de l'image de couverture</label>
            <input
              type="text"
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Réduction (%)</label>
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Membres min.</label>
              <input
                type="number"
                value={formData.minMembers}
                onChange={(e) => setFormData({ ...formData, minMembers: Number(e.target.value) })}
                className="w-full bg-zinc-800 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-pink-500"
              />
            </div>
          </div>

          {/* Boutons d'actions (Supprimer à gauche, Annuler/Enregistrer à droite) */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-6">
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition font-medium text-sm"
            >
              🗑️ Supprimer
            </button>

            <div className="flex gap-3">
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
                {loading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}