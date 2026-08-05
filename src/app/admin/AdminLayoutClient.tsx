"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/content", label: "Kontent", icon: "movie" },
  { href: "/admin/settings", label: "Sozlamalar", icon: "settings" },
];

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-surface-container-lowest border-r border-border-glass flex-shrink-0 hidden md:flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border-glass">
          <Link href="/admin" className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-2xl text-primary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              admin_panel_settings
            </span>
            <span className="text-lg font-bold text-on-surface tracking-tight">
              Nocturne <span className="text-primary">Admin</span>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                }`}
              >
                <span className="material-symbols-outlined text-xl">{link.icon}</span>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border-glass">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-xl">arrow_back</span>
            Saytga qaytish
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-surface-container-lowest/80 backdrop-blur-md border-b border-border-glass flex items-center justify-between px-6 sticky top-0 z-40">
          {/* Mobile menu */}
          <div className="md:hidden flex items-center gap-3">
            <Link href="/admin" className="text-lg font-bold text-primary">
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
                    isActive ? "text-primary bg-primary/10" : "text-on-surface-variant"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{link.icon}</span>
                </Link>
              );
            })}
          </nav>

          {/* Search */}
          <div className="hidden md:flex items-center gap-3 flex-1">
            <div className="relative max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none">
                search
              </span>
              <input
                className="w-full bg-surface-container-low border border-transparent rounded-xl py-2 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline outline-none focus:border-primary/50 transition-all"
                placeholder="Qidirish..."
                type="text"
              />
            </div>
          </div>

          {/* Admin User */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant">
              <span className="material-symbols-outlined text-xl">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
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
