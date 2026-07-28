"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/motion";

export default function ShareGroupButton({ groupTitle }: { groupTitle: string }) {
  const handleWhatsAppShare = () => {
    // Récupère l'URL actuelle de la page du groupe
    const url = window.location.href;
    
    // Message pré-rempli pour WhatsApp
    const message = `🛍️ Rejoins ma vente groupée "${groupTitle}" sur Sheela pour profiter de superbes réductions ! C'est par ici : ${url}`;
    
    // Ouvre l'API de partage WhatsApp dans un nouvel onglet
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <Button
      onClick={handleWhatsAppShare}
      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center gap-2 font-medium py-3 rounded-xl transition-all shadow-lg shadow-emerald-900/20"
    >
      <MessageCircle className="h-5 w-5 fill-current" />
      Partager le groupe sur WhatsApp
    </Button>
  );
}