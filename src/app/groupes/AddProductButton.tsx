"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import AddProductModal from "../../app/api/products/AddProductModal";

interface AddProductButtonProps {
  vendorId: string;
  categories: Array<{ id: string; name: string }>;
}

export default function AddProductButton({ vendorId, categories }: AddProductButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold text-sm shadow-lg hover:opacity-90 transition"
      >
        <Plus className="h-5 w-5" />
        Ajouter un article à ma galerie
      </button>

      <AddProductModal
        vendorId={vendorId}
        categories={categories}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
}