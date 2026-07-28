"use client";

import { useState } from "react";
import { Copy, Check, Smartphone } from "lucide-react";

interface MobileMoneyProps {
  vendorName: string;
  vendorPhone: string;
}

export default function MobileMoneyInstructions({ vendorName, vendorPhone }: MobileMoneyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!vendorPhone) return;
    navigator.clipboard.writeText(vendorPhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-4 space-y-3">
      <div className="flex items-center gap-2 text-pink-400 font-medium text-sm">
        <Smartphone className="h-4 w-4" />
        <span>Instructions de Paiement Mobile Money</span>
      </div>
      
      <p className="text-xs text-zinc-400 leading-relaxed">
        Pour valider ta participation, effectue le transfert du montant total au nom de <strong className="text-white">{vendorName}</strong> via le numéro ci-dessous :
      </p>

      {vendorPhone ? (
        <div className="flex items-center justify-between bg-black/30 border border-white/10 rounded-xl px-3 py-2">
          <span className="font-mono text-sm font-bold text-white tracking-wider">{vendorPhone}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-medium transition-all shadow-sm"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-white" />
                <span>Copié !</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copier</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <p className="text-xs text-zinc-500 italic">Numéro de la créatrice non renseigné.</p>
      )}

      <p className="text-[11px] text-zinc-500 italic">
        💡 Pense à bien conserver ton SMS de confirmation de transaction pour le transmettre à la créatrice si besoin.
      </p>
    </div>
  );
}