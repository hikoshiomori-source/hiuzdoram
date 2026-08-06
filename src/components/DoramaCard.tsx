import Image from "next/image";
import Link from "next/link";
import { Drama } from "@/lib/types";

interface DoramaCardProps {
  drama: Drama;
  index?: number;
}

export default function DoramaCard({ drama, index }: DoramaCardProps) {
  const currentEp = drama.episodes.length;
  return (
    <Link
      href={`/watch/${drama.id}`}
      className="flex flex-col gap-3 group cursor-pointer relative animate-card-entrance"
      style={{ animationDelay: index ? `${index * 60}ms` : "0ms" }}
    >
      {/* Poster — Cinematic hover */}
      <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden shadow-lg card-cinematic">
        <Image
          src={drama.poster || "https://placehold.co/400x600/1a1a24/732ee4?text=No+Poster"}
          alt={`${drama.title} — ${drama.genres.join(", ")} dorama poster`}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

        {/* Badges */}
        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
          <span
            className={`px-2 py-0.5 rounded text-xs font-medium shadow-md backdrop-blur-sm ${
              drama.status === "Ongoing"
                ? "bg-surface-glass border border-border-glass text-on-surface"
                : drama.status === "Completed"
                ? "bg-success/90 text-surface-base"
                : "bg-primary/90 text-on-primary"
            }`}
          >
            {drama.status === "Ongoing"
              ? `Ep ${currentEp}/${drama.totalEpisodes}`
              : drama.status === "Completed"
              ? "Tugallangan"
              : "YANGI"}
          </span>
          <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-brand-rose/90 text-white text-xs font-medium shadow-md backdrop-blur-sm">
            <span
              className="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              star
            </span>
            {drama.rating}
          </span>
        </div>

        {/* Hover Play Icon */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-14 h-14 rounded-full bg-primary/80 backdrop-blur flex items-center justify-center text-on-primary shadow-[0_0_24px_rgba(210,187,255,0.8)] scale-75 group-hover:scale-100 transition-transform duration-300">
            <span
              className="material-symbols-outlined text-3xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              play_arrow
            </span>
          </div>
        </div>
      </div>

      {/* Title */}
      <div>
        <h3 className="font-semibold text-on-surface truncate group-hover:text-primary transition-premium">
          {drama.title}
        </h3>
        <p className="text-xs text-text-secondary">
          {drama.genres.join(", ")} • {drama.year}
        </p>
      </div>
    </Link>
  );
}
