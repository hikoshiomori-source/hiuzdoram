"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { IMAGES } from "@/lib/data";

const navLinks = [
  { href: "/", label: "Bosh sahifa", icon: "home" },
  { href: "/browse", label: "Doramalar", icon: "movie" },
  { href: "/top-100", label: "Top 100", icon: "trophy" },
  { href: "/schedule", label: "Jadval", icon: "calendar_month" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Don't show navbar on admin pages
  if (pathname.startsWith("/admin") || pathname === "/become-admin") return null;

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-glass backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.15)] border-b border-border-glass">
      <div className="h-16 md:h-20 w-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-[0_0_10px_rgba(210,187,255,0.2)] group-hover:shadow-[0_0_15px_rgba(210,187,255,0.4)] transition-shadow">
            <Image
              src={IMAGES.logo}
              alt="HiUzDoram"
              fill
              className="object-contain"
              sizes="32px"
            />
          </div>
          <span className="hidden lg:block text-xl font-bold tracking-tight text-primary group-hover:text-primary-fixed drop-shadow-[0_0_5px_rgba(210,187,255,0.3)] transition-all">
            HiUzDoram
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isActive
                    ? "text-primary bg-primary/10 shadow-[0_0_15px_rgba(210,187,255,0.2)]"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 hover:shadow-[0_0_10px_rgba(255,255,255,0.05)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Search */}
        <div className="flex-1 max-w-md hidden md:block relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
            search
          </span>
          <input
            className={`w-full bg-surface-base/60 border rounded-full py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline outline-none transition-all duration-300 ${
              searchFocused
                ? "border-primary/50 ring-2 ring-primary/20 bg-surface-base shadow-[0_0_15px_rgba(210,187,255,0.15)]"
                : "border-border-glass hover:border-outline/50 hover:bg-surface-base/80"
            }`}
            placeholder="Dorama, film yoki aktyor qidiring..."
            type="text"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2 relative">
          <button className="relative p-2 rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full shadow-[0_0_5px_rgba(255,180,171,0.5)]" />
          </button>

          <button
            className="p-2 rounded-full hover:bg-surface-variant transition-colors text-on-surface-variant xl:hidden ml-1"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <span className="material-symbols-outlined text-xl">
              {mobileOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="xl:hidden bg-surface-container/95 backdrop-blur-xl border-t border-border-glass animate-fade-in-up">
          <nav className="flex flex-col p-4 gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "text-primary bg-primary/10 shadow-[0_0_10px_rgba(210,187,255,0.15)]"
                      : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
            
            {/* Mobile search */}
            <div className="relative mt-2 md:hidden">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
                search
              </span>
              <input
                className="w-full bg-surface-base/60 border border-border-glass rounded-full py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline outline-none focus:border-primary/50 focus:bg-surface-base"
                placeholder="Qidiring..."
                type="text"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
