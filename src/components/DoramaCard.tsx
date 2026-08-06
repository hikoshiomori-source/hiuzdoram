import Image from "next/image";
import Link from "next/link";
import { Drama } from "@/lib/types";

interface DoramaCardProps {
  drama: Drama;
  index?: number;
}

export default function DoramaCard({ drama, index }: DoramaCardProps) {
  return (
    <Link
      href={`/watch/${drama.id}`}
      className="block group"
      style={{ animationDelay: index ? `${index * 50}ms` : "0ms" }}
    >
      <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden bg-[#18181b] card-hover">
        <Image
          src={drama.poster || "https://placehold.co/400x600/18181b/e11d48?text=No+Poster"}
          alt={`${drama.title} poster`}
          fill
          className="w-full h-full object-cover transition-smooth"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-smooth flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[#e11d48] flex items-center justify-center translate-y-4 group-hover:translate-y-0 transition-smooth shadow-[0_0_15px_rgba(225,29,72,0.5)]">
            <span
              className="material-symbols-outlined text-white text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              play_arrow
            </span>
          </div>
        </div>

        {/* Rating Badge */}
        {drama.rating && (
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-md flex items-center gap-1 z-10 border border-white/10">
            <span className="material-symbols-outlined text-[12px] text-[#e11d48]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            {drama.rating}
          </div>
        )}
        
        {/* New Episode Badge (optional) */}
        {drama.episodes && drama.episodes.length > 0 && (
          <div className="absolute top-2 left-2 bg-[#e11d48] text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-wide z-10">
            {drama.episodes.length} Qism
          </div>
        )}
      </div>
      
      <div className="mt-3">
        <h3 className="text-sm font-semibold text-[#e4e4e7] group-hover:text-[#e11d48] transition-colors duration-200 text-truncate-2">
          {drama.title}
        </h3>
        <div className="flex items-center gap-2 mt-1 text-xs text-[#a1a1aa]">
          <span>{drama.year}</span>
          {drama.country && (
            <>
              <span className="w-1 h-1 rounded-full bg-[#3f3f46]"></span>
              <span>{drama.country}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
