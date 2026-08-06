"use client";

import { useState } from "react";
import DoramaCard from "@/components/DoramaCard";
import { Drama } from "@/lib/types";

const genres = ["Hammasi", "Romantika", "Jangari", "Fantastika", "Tibbiyot", "Triller", "Ilmiy-fantastika", "Tarixiy", "Hayotiy", "Komediya", "Sirlar", "Melodrama"];
const countries = ["Hammasi", "Janubiy Koreya", "Yaponiya", "Xitoy", "Tailand"];
const statuses = ["Hammasi", "Ongoing", "Completed"];

export default function ClientBrowse({ dramas }: { dramas: Drama[] }) {
  const [activeGenre, setActiveGenre] = useState("Hammasi");
  const [activeCountry, setActiveCountry] = useState("Hammasi");
  const [activeStatus, setActiveStatus] = useState("Hammasi");

  const filtered = dramas.filter((d) => {
    const genreMatch = activeGenre === "Hammasi" || (d.genres && d.genres.includes(activeGenre));
    const countryMatch = activeCountry === "Hammasi" || 
      (activeCountry === "Janubiy Koreya" && d.country === "South Korea") ||
      (activeCountry === "Yaponiya" && d.country === "Japan") ||
      (activeCountry === "Xitoy" && d.country === "China") ||
      (activeCountry === "Tailand" && d.country === "Thailand") ||
      (d.country === activeCountry);
    const statusMatch = activeStatus === "Hammasi" || d.status === activeStatus;
    return genreMatch && countryMatch && statusMatch;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-24 min-h-screen flex flex-col md:flex-row gap-8 items-start">
      
      {/* Sidebar Filters */}
      <aside className="w-full md:w-64 flex-shrink-0 bg-[#18181b] border border-[#27272a] rounded-xl p-6 sticky top-24">
        <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-[#e11d48]">tune</span>
          Filterlar
        </h2>

        {/* Genre */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#a1a1aa] mb-3 uppercase tracking-wider">Janr</h3>
          <div className="flex flex-col gap-2">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                className={`text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
                  activeGenre === genre
                    ? "bg-[#e11d48] text-white font-medium"
                    : "text-[#e4e4e7] hover:bg-[#27272a]"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Country */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#a1a1aa] mb-3 uppercase tracking-wider">Davlat</h3>
          <div className="flex flex-col gap-2">
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCountry(c)}
                className={`text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
                  activeCountry === c
                    ? "bg-[#e11d48] text-white font-medium"
                    : "text-[#e4e4e7] hover:bg-[#27272a]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <h3 className="text-sm font-semibold text-[#a1a1aa] mb-3 uppercase tracking-wider">Holat</h3>
          <div className="flex flex-col gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                className={`text-left text-sm px-3 py-1.5 rounded-md transition-colors ${
                  activeStatus === s
                    ? "bg-[#e11d48] text-white font-medium"
                    : "text-[#e4e4e7] hover:bg-[#27272a]"
                }`}
              >
                {s === "Ongoing" ? "Davom etmoqda" : s === "Completed" ? "Tugallangan" : s}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Grid */}
      <div className="flex-1 w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">
            Barcha Doramalar
          </h1>
          <p className="text-sm text-[#a1a1aa]">
            {filtered.length} ta topildi
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filtered.map((drama, i) => (
              <DoramaCard key={drama.id} drama={drama} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-[#18181b] border border-[#27272a] rounded-xl">
            <span className="material-symbols-outlined text-6xl mb-4 text-[#3f3f46]">search_off</span>
            <p className="text-lg font-semibold text-white">Hech narsa topilmadi</p>
            <p className="text-sm text-[#a1a1aa] mt-1">Boshqa filterlarni tanlab ko'ring.</p>
            <button 
              onClick={() => { setActiveGenre("Hammasi"); setActiveCountry("Hammasi"); setActiveStatus("Hammasi"); }}
              className="mt-6 px-6 py-2 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-md transition-colors text-sm font-medium"
            >
              Filterni tozalash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
