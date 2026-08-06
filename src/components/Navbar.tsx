"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Mobile specific states
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll for solid background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
    setSearchOpen(false);
  }, [pathname]);

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
    setMobileSearchOpen(false);
    router.push(`/watch/${id}`);
  };

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
        // If clicking outside mobile search when it's open, maybe close it, but only if not clicking the toggle button itself
        // Handled by the overlay below
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const SearchDropdown = ({ isMobile = false }: { isMobile?: boolean }) => {
    if (!searchOpen) return null;
    return (
      <div className={`absolute left-0 right-0 bg-[#18181b] border border-[#27272a] shadow-2xl z-[100] max-h-[400px] overflow-y-auto ${isMobile ? 'top-[calc(100%+8px)] mx-4 rounded-lg' : 'top-[calc(100%+8px)] rounded-lg'}`}>
        {searchLoading ? (
          <div className="p-6 text-center">
            <span className="material-symbols-outlined text-[#e11d48] animate-spin">progress_activity</span>
          </div>
        ) : searchResults.length > 0 ? (
          <div className="py-2">
            {searchResults.map((result) => (
              <button
                key={result.id}
                onClick={() => handleResultClick(result.id)}
                className="w-full flex items-center gap-4 px-4 py-3 hover:bg-[#27272a] transition-colors text-left"
              >
                <div className="w-12 h-16 rounded bg-[#27272a] overflow-hidden flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.poster_url}
                    alt={result.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate">
                    {result.title}
                  </h4>
                  {result.title_uz && (
                    <p className="text-xs text-[#a1a1aa] truncate mt-0.5">{result.title_uz}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5 text-xs text-[#a1a1aa]">
                    <span>{result.year}</span>
                    <span className="flex items-center gap-0.5 text-[#e11d48]">
                      <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      {result.rating}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-sm text-[#a1a1aa]">Hech narsa topilmadi</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled || mobileMenuOpen || mobileSearchOpen ? "bg-[#09090b]/95 backdrop-blur-md border-b border-[#27272a]" : "bg-transparent"
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 flex items-center gap-4 md:gap-8">
          {/* Brand Logo */}
          <Link href="/" className="flex flex-col flex-shrink-0 group">
            <span className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none">
              <span className="text-[#e11d48]">hi</span>uzdoram
            </span>
            <span className="text-[9px] md:text-[10px] text-[#a1a1aa] font-medium tracking-widest uppercase mt-0.5 group-hover:text-white transition-colors">
              Birinchi va Sifatli
            </span>
          </Link>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex gap-6 items-center flex-shrink-0">
            <Link href="/browse" className="text-sm font-medium text-[#a1a1aa] hover:text-white transition-colors">
              Barcha Doramalar
            </Link>
            <Link href="/top-100" className="text-sm font-medium text-[#a1a1aa] hover:text-white transition-colors">
              Top 100
            </Link>
            <Link href="/schedule" className="text-sm font-medium text-[#a1a1aa] hover:text-white transition-colors">
              Taqvim
            </Link>
          </nav>
          
          {/* Desktop Search Bar */}
          <div className="flex-1 max-w-xl ml-auto relative hidden md:block" ref={searchRef}>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] pointer-events-none text-xl">search</span>
              <input
                className="w-full bg-[#18181b]/80 border border-[#27272a] hover:border-[#3f3f46] text-white rounded-md py-2 pl-10 pr-4 focus:outline-none focus:border-[#e11d48] text-sm transition-colors"
                placeholder="Dorama yoki aktyor qidirish..."
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setSearchOpen(true); }}
              />
            </div>
            <SearchDropdown />
          </div>
          
          {/* Mobile Actions */}
          <div className="md:hidden ml-auto flex items-center gap-3">
            <button 
              onClick={() => {
                setMobileSearchOpen(!mobileSearchOpen);
                setMobileMenuOpen(false);
              }} 
              className={`text-[#a1a1aa] hover:text-white transition-colors ${mobileSearchOpen ? 'text-[#e11d48]' : ''}`}
            >
              <span className="material-symbols-outlined">{mobileSearchOpen ? 'close' : 'search'}</span>
            </button>
            <button 
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                setMobileSearchOpen(false);
              }} 
              className={`text-[#a1a1aa] hover:text-white transition-colors ${mobileMenuOpen ? 'text-[#e11d48]' : ''}`}
            >
              <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expandable */}
        {mobileSearchOpen && (
          <div className="md:hidden border-t border-[#27272a] p-4 bg-[#09090b]/95 backdrop-blur-md relative" ref={mobileSearchRef}>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] pointer-events-none">search</span>
              <input
                autoFocus
                className="w-full bg-[#18181b] border border-[#27272a] text-white rounded-md py-3 pl-10 pr-4 focus:outline-none focus:border-[#e11d48] text-sm"
                placeholder="Qidirish..."
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInput(e.target.value)}
                onFocus={() => { if (searchResults.length > 0) setSearchOpen(true); }}
              />
            </div>
            <SearchDropdown isMobile={true} />
          </div>
        )}

        {/* Mobile Menu Expandable */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#27272a] bg-[#09090b]/95 backdrop-blur-md flex flex-col px-4 py-6 gap-6">
            <nav className="flex flex-col gap-4">
              <Link href="/browse" className="text-base font-semibold text-white flex items-center gap-3 border-b border-[#27272a] pb-4">
                <span className="material-symbols-outlined text-[#e11d48]">movie</span> Barcha Doramalar
              </Link>
              <Link href="/top-100" className="text-base font-semibold text-white flex items-center gap-3 border-b border-[#27272a] pb-4">
                <span className="material-symbols-outlined text-[#e11d48]">trophy</span> Top 100
              </Link>
              <Link href="/schedule" className="text-base font-semibold text-white flex items-center gap-3 border-b border-[#27272a] pb-4">
                <span className="material-symbols-outlined text-[#e11d48]">calendar_month</span> Taqvim
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Overlay to close mobile menu/search when clicking outside */}
      {(mobileMenuOpen || mobileSearchOpen) && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setMobileMenuOpen(false);
            setMobileSearchOpen(false);
          }}
        />
      )}
    </>
  );
}
