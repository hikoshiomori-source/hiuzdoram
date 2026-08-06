"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const navLinks = [
  { href: "/", label: "Bosh sahifa", icon: "home" },
  { href: "/browse", label: "Doramalar", icon: "movie" },
  { href: "/top-100", label: "Top 100", icon: "trophy" },
  { href: "/schedule", label: "Jadval", icon: "calendar_month" },
];

interface SearchResult {
  id: string;
  title: string;
  title_uz: string | null;
  poster_url: string;
  year: number;
  rating: number;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Don't show navbar on admin pages
  if (pathname.startsWith("/admin") || pathname === "/become-admin") return null;

  const searchDramas = useCallback(async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }
    setSearchLoading(true);
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await supabase
        .from("dramas")
        .select("id, title, title_uz, poster_url, year, rating")
        .or(`title.ilike.%${query}%,title_uz.ilike.%${query}%`)
        .limit(6);
      setSearchResults(data || []);
      setSearchOpen(true);
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      searchDramas(value);
    }, 300);
  };

  const handleResultClick = (id: string) => {
    setSearchQuery("");
    setSearchResults([]);
    setSearchOpen(false);
    setMobileOpen(false);
    router.push(`/watch/${id}`);
  };

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        searchRef.current && !searchRef.current.contains(e.target as Node) &&
        mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const SearchDropdown = () => {
    if (!searchOpen) return null;
    return (
      <div className="absolute top-full left-0 right-0 mt-2 glass-panel-strong shadow-2xl z-[100] max-h-[400px] overflow-y-auto animate-scale-in">
        {searchLoading ? (
          <div className="p-6 text-center">
            <span className="material-symbols-outlined text-primary animate-spin text-2xl">progress_activity</span>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="py-2">
            {searchResults.map((result) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result.id)}
                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-surface-variant/50 transition-premium text-left"
              >
                <div className="w-10 h-14 rounded-lg overflow-hidden flex-shrink-0 relative bg-surface-container">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.poster_url}
                    alt={result.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-on-surface truncate">
                    {result.title}
                  </h4>
                  {result.title_uz && (
                    <p className="text-xs text-text-secondary truncate">{result.title_uz}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                    <span>{result.year}</span>
                    <span className="flex items-center gap-0.5 text-brand-rose">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      {result.rating}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined text-outline text-xl">chevron_right</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <span className="material-symbols-outlined text-surface-bright text-3xl mb-2 block">search_off</span>
            <p className="text-sm text-text-secondary">Hech narsa topilmadi</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-glass backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.15)] border-b border-border-glass">
      <div className="h-16 md:h-20 w-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Logo — Stitch Style */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <span className="stitch-logo text-xl md:text-2xl">hiuzdoram</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden xl:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-premium ${
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

        {/* Search — Desktop */}
        <div className="flex-1 max-w-md hidden md:block relative" ref={searchRef}>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none z-10">
            search
          </span>
          <input
            className={`w-full bg-surface-base/60 border rounded-full py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline outline-none transition-premium ${
              searchOpen
                ? "border-primary/50 ring-2 ring-primary/20 bg-surface-base shadow-[0_0_15px_rgba(210,187,255,0.15)]"
                : "border-border-glass hover:border-outline/50 hover:bg-surface-base/80"
            }`}
            placeholder="Dorama, film yoki aktyor qidiring..."
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            onFocus={() => { if (searchResults.length > 0) setSearchOpen(true); }}
          />
          <SearchDropdown />
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2 relative">
          <button className="relative p-2 rounded-full hover:bg-surface-variant transition-premium text-on-surface-variant">
            <span className="material-symbols-outlined text-xl">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full shadow-[0_0_5px_rgba(255,180,171,0.5)]" />
          </button>

          <button
            className="p-2 rounded-full hover:bg-surface-variant transition-premium text-on-surface-variant xl:hidden ml-1"
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
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-premium ${
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
            <div className="relative mt-2" ref={mobileSearchRef}>
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl pointer-events-none">
                search
              </span>
              <input
                className="w-full bg-surface-base/60 border border-border-glass rounded-full py-2.5 pl-10 pr-4 text-sm text-on-surface placeholder:text-outline outline-none focus:border-primary/50 focus:bg-surface-base transition-premium"
                placeholder="Qidiring..."
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
              />
              <SearchDropdown />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
