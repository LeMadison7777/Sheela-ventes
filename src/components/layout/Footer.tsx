import Link from "next/link";
import { Sparkles, Camera, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#080012] mt-auto">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-violet-600">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">Sheela</span>
            </div>
            <p className="text-sm text-zinc-500 max-w-sm leading-relaxed">
              La plateforme pour créatrices de ventes groupées. Habits, accessoires,
              parfums, chaussures, ongles — organisez vos commandes en toute simplicité.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/catalogue" className="hover:text-pink-400 transition-colors">Catalogue</Link></li>
              <li><Link href="/groupes" className="hover:text-pink-400 transition-colors">Groupes actifs</Link></li>
              <li><Link href="/groupes/creer" className="hover:text-pink-400 transition-colors">Créer un groupe</Link></li>
              <li><Link href="/dashboard" className="hover:text-pink-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li className="flex items-center gap-2">
                <Camera className="h-4 w-4" /> ngoyiexauceroro@gmail.com
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />  <Link href="https://wa.me/242066099427" className="hover:text-pink-400 transition-colors">WhatsApp Business</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} Sheela — Ventes groupées mode & beauté
        </div>
      </div>
    </footer>
  );
}
