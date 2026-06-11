"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ShoppingBag, Sparkles, X, LayoutDashboard, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/catalogue", label: "Catalogue" },
  { href: "/groupes", label: "Groupes" },
  { href: "/dashboard", label: "Dashboard" },
];

type User = { id: string; name: string; email: string };

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function logout() {
    await fetch("/api/auth/me", { method: "DELETE" });
    setUser(null);
    window.location.href = "/";
  }

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#0a0118]/80 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-pink-500/5"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-violet-600 shadow-lg shadow-pink-500/30 group-hover:scale-105 transition-transform">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-pink-300 to-violet-300 bg-clip-text text-transparent">
            Sheela
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-all",
                pathname === link.href
                  ? "bg-white/10 text-pink-300"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-zinc-400">
                Bonjour, <span className="text-pink-300">{user.name}</span>
              </span>
              <Link
                href="/groupes/creer"
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:scale-105 transition-all"
              >
                <ShoppingBag className="h-4 w-4" />
                Créer un groupe
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Déconnexion"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Connexion
              </Link>
              <Link
                href="/inscription"
                className="rounded-full bg-gradient-to-r from-pink-500 to-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 hover:scale-105 transition-all"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden p-2 text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-[#0a0118]/95 backdrop-blur-xl"
          >
            <div className="flex flex-col gap-2 p-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium",
                    pathname === link.href
                      ? "bg-white/10 text-pink-300"
                      : "text-zinc-400"
                  )}
                >
                  {link.href === "/dashboard" && <LayoutDashboard className="h-4 w-4" />}
                  {link.label}
                </Link>
              ))}
              {!user && (
                <>
                  <Link href="/connexion" onClick={() => setOpen(false)} className="px-4 py-3 text-zinc-400">
                    Connexion
                  </Link>
                  <Link
                    href="/inscription"
                    onClick={() => setOpen(false)}
                    className="mt-2 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 px-4 py-3 text-center text-sm font-semibold text-white"
                  >
                    S&apos;inscrire
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
