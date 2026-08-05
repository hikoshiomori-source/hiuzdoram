"use client";

import { useState } from "react";
import DoramaCard from "@/components/DoramaCard";
import { Drama } from "@/lib/types";

const genres = ["Hammasi", "Romance", "Action", "Fantasy", "Medical", "Thriller", "Sci-Fi", "Historical", "Slice of Life"];
const countries = ["Hammasi", "South Korea", "Japan", "China", "Thailand"];
const statuses = ["Hammasi", "Ongoing", "Completed"];

export default function ClientBrowse({ dramas }: { dramas: Drama[] }) {
  const [activeGenre, setActiveGenre] = useState("Hammasi");
  const [activeCountry, setActiveCountry] = useState("Hammasi");
  const [activeStatus, setActiveStatus] = useState("Hammasi");

  const filtered = dramas.filter((d) => {
    const genreMatch = activeGenre === "Hammasi" || d.genres.includes(activeGenre);
    const countryMatch = activeCountry === "Hammasi" || d.country === activeCountry;
    const statusMatch = activeStatus === "Hammasi" || d.status === activeStatus;
    return genreMatch && countryMatch && statusMatch;
  });

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
          Doramalar
        </h1>
        <p className="text-on-surface-variant mt-2">
          Eng sara koreyscha, yaponcha va xitoycha seriallarni kashf eting
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 mb-8 bg-surface-container-low/50 p-4 rounded-2xl backdrop-blur-md border border-border-glass">
        {/* Genre */}
        <div>
          <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-2 block">Janr</span>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                  activeGenre === genre
                    ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(210,187,255,0.3)]"
                    : "bg-surface-container-high hover:bg-surface-variant text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Country + Status */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-2 block">Mamlakat</span>
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCountry(c)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCountry === c
                      ? "bg-secondary/20 text-secondary border border-secondary/30"
                      : "bg-surface-container-high hover:bg-surface-variant text-on-surface-variant"
                  }`}
                >
                  {c === "Hammasi" ? c : c === "South Korea" ? "🇰🇷 Koreya" : c === "Japan" ? "🇯🇵 Yaponiya" : c === "China" ? "🇨🇳 Xitoy" : "🇹🇭 Tailand"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="text-xs text-text-secondary uppercase tracking-wider font-semibold mb-2 block">Holati</span>
            <div className="flex items-center gap-2">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setActiveStatus(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeStatus === s
                      ? "bg-tertiary/20 text-tertiary border border-tertiary/30"
                      : "bg-surface-container-high hover:bg-surface-variant text-on-surface-variant"
                  }`}
                >
                  {s === "Hammasi" ? s : s === "Ongoing" ? "Davom etmoqda" : "Tugallangan"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-text-secondary mb-6">
        {filtered.length} ta dorama topildi
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
          {filtered.map((drama, i) => (
            <DoramaCard key={drama.id} drama={drama} index={i} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
          <span className="material-symbols-outlined text-6xl mb-4 text-surface-bright">search_off</span>
          <p className="text-lg font-semibold">Hech narsa topilmadi</p>
          <p className="text-sm text-text-secondary mt-1">Filtrlarni o&apos;zgartirib ko&apos;ring</p>
        </div>
      )}
    </div>
  );
}
