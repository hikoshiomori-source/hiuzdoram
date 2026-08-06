"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "../become-admin/actions";
import { useState } from "react";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/content", label: "Kontent", icon: "movie" },
  { href: "/admin/settings", label: "Sozlamalar", icon: "settings" },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logoutAdmin();
  };

  return (
    <div className="flex min-h-screen bg-[#09090b]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#18181b] border-r border-[#27272a] flex-shrink-0 hidden md:flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-[#27272a]">
          <Link href="/admin" className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-2xl text-[#e11d48]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              admin_panel_settings
            </span>
            <span className="text-lg font-bold text-white tracking-tight">
              HiUzDoram <span className="text-[#e11d48]">Admin</span>
            </span>
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {adminLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-[#e11d48]/10 text-[#e11d48] border border-[#e11d48]/20"
                    : "text-[#a1a1aa] hover:text-white hover:bg-[#27272a]"
                }`}
              >
                <span className="material-symbols-outlined text-xl">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#27272a] flex flex-col gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-[#a1a1aa] hover:text-white hover:bg-[#27272a] transition-all"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            Saytga qaytish
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-[#a1a1aa] hover:text-[#e11d48] hover:bg-[#e11d48]/10 transition-all text-left w-full disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            {isLoggingOut ? "Chiqilmoqda..." : "Tizimdan chiqish"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-[#18181b]/90 backdrop-blur-md border-b border-[#27272a] flex items-center justify-between px-6 sticky top-0 z-40">
          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-3">
            <Link href="/admin" className="text-lg font-bold text-[#e11d48]">
              Admin
            </Link>
          </div>

          {/* Mobile nav */}
          <nav className="md:hidden flex items-center gap-1">
            {adminLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`p-2 rounded-lg transition-colors ${
                    isActive ? "text-[#e11d48] bg-[#e11d48]/10" : "text-[#a1a1aa]"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{link.icon}</span>
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="p-2 rounded-lg text-[#a1a1aa] hover:text-[#e11d48] transition-colors ml-2"
            >
              <span className="material-symbols-outlined text-xl">logout</span>
            </button>
          </nav>

          {/* Search */}
          <div className="hidden md:flex items-center gap-3 flex-1">
            <div className="relative max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] text-lg pointer-events-none">
                search
              </span>
              <input
                className="w-full bg-[#09090b] border border-[#27272a] rounded-lg py-2 pl-10 pr-4 text-sm text-white placeholder:text-[#a1a1aa] outline-none focus:border-[#e11d48] transition-all"
                placeholder="Qidirish..."
                type="text"
              />
            </div>
          </div>

          {/* Admin User */}
          <div className="hidden md:flex items-center gap-3">
            <button className="relative p-2 rounded-full hover:bg-[#27272a] transition-colors text-[#a1a1aa]">
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#e11d48] rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#e11d48]/20 flex items-center justify-center text-[#e11d48] text-sm font-bold">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
