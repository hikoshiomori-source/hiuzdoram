import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MoverPlayer from "@/components/MoverPlayer";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ── Dynamic SEO Metadata ──
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = getSupabase();
  const { data: drama } = await supabase
    .from("dramas")
    .select("title, title_uz, synopsis, poster_url, year, genres, country, rating")
    .eq("id", id)
    .single();

  if (!drama) {
    return { title: "Dorama topilmadi — hiuzdoram" };
  }

  const genres = Array.isArray(drama.genres)
    ? drama.genres
    : typeof drama.genres === "string"
    ? drama.genres.replace(/^{|}$/g, "").split(",")
    : [];

  const title = `${drama.title}${drama.title_uz ? ` (${drama.title_uz})` : ""} — O'zbek tilida tomosha qiling | hiuzdoram`;
  const description = `${drama.title} (${drama.year}) — ${genres.join(", ")}. ${drama.synopsis?.slice(0, 140) || "Premium sifatda o'zbek subtitrlar bilan tomosha qiling."}`;

  return {
    title,
    description,
    openGraph: {
      title: `${drama.title} — hiuzdoram`,
      description,
      images: drama.poster_url ? [{ url: drama.poster_url, width: 400, height: 600, alt: drama.title }] : [],
      type: "video.tv_show",
      siteName: "hiuzdoram",
    },
    twitter: {
      card: "summary_large_image",
      title: `${drama.title} — hiuzdoram`,
      description,
      images: drama.poster_url ? [drama.poster_url] : [],
    },
    alternates: {
      canonical: `https://hiuzdoram.site/watch/${id}`,
    },
  };
}

// ── Page Props ──
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function WatchPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const dramaId = resolvedParams.id;
  const currentEpId =
    typeof resolvedSearchParams.ep === "string" ? resolvedSearchParams.ep : null;

  const supabase = getSupabase();

  const { data: dbDrama, error } = await supabase
    .from("dramas")
    .select(`*, episodes (*)`)
    .eq("id", dramaId)
    .single();

  if (error || !dbDrama) {
    notFound();
  }

  const genres = Array.isArray(dbDrama.genres)
    ? dbDrama.genres
    : typeof dbDrama.genres === "string"
    ? dbDrama.genres.replace(/^{|}$/g, "").split(",")
    : [];

  const drama = {
    id: dbDrama.id,
    title: dbDrama.title,
    titleUz: dbDrama.title_uz,
    poster: dbDrama.poster_url,
    backdrop: dbDrama.backdrop_url,
    year: dbDrama.year,
    rating: dbDrama.rating,
    genres,
    country: dbDrama.country,
    totalEpisodes: dbDrama.total_episodes,
    status: dbDrama.status,
    synopsis: dbDrama.synopsis,
    episodes: (dbDrama.episodes || [])
      .sort((a: any, b: any) => a.episode_number - b.episode_number)
      .map((ep: any) => ({
        id: ep.id,
        number: ep.episode_number,
        title: ep.title,
        moverEmbedUrl: ep.mover_embed_url,
        duration: ep.duration,
      })),
  };

  let currentEpisode = drama.episodes[0];
  if (currentEpId) {
    const found = drama.episodes.find((ep: any) => ep.id === currentEpId);
    if (found) currentEpisode = found;
  }

  if (!currentEpisode) {
    return (
      <>
        <Navbar />
        <main className="w-full pt-20 bg-background min-h-screen flex items-center justify-center">
          <p className="text-on-surface-variant">
            Ushbu dorama uchun qismlar topilmadi.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  // ── Schema.org Structured Data ──
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@type": "TVSeries",
    name: drama.title,
    alternateName: drama.titleUz || undefined,
    description: drama.synopsis,
    image: drama.poster,
    datePublished: String(drama.year),
    genre: drama.genres,
    countryOfOrigin: {
      "@type": "Country",
      name: drama.country,
    },
    numberOfEpisodes: drama.totalEpisodes,
    aggregateRating: drama.rating
      ? {
          "@type": "AggregateRating",
          ratingValue: drama.rating,
          bestRating: 10,
          ratingCount: 1,
        }
      : undefined,
    url: `https://hiuzdoram.site/watch/${drama.id}`,
    episode: {
      "@type": "TVEpisode",
      name: currentEpisode.title,
      episodeNumber: currentEpisode.number,
      video: {
        "@type": "VideoObject",
        name: `${drama.title} — ${currentEpisode.number}-qism: ${currentEpisode.title}`,
        description: drama.synopsis,
        thumbnailUrl: drama.backdrop || drama.poster,
        uploadDate: String(drama.year),
        embedUrl: currentEpisode.moverEmbedUrl,
        duration: currentEpisode.duration ? `PT${currentEpisode.duration.replace(":", "H")}M` : undefined,
      },
    },
    potentialAction: {
      "@type": "WatchAction",
      target: `https://hiuzdoram.site/watch/${drama.id}`,
    },
  };

  return (
    <>
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />

      <Navbar />
      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          {/* Left Column: Video & Info */}
          <article className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            {/* Player Container */}
            <div className="w-full bg-surface-base rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-border-glass animate-scale-in">
              <MoverPlayer
                key={currentEpisode.id}
                embedUrl={currentEpisode.moverEmbedUrl}
                title={`${drama.title} — ${currentEpisode.number}-qism`}
              />

              {/* Player Bottom Bar */}
              <div className="bg-surface-container-low p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-border-glass">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-on-surface">
                    {drama.title}
                  </h1>
                  <p className="text-sm text-primary font-medium mt-1">
                    {currentEpisode.number}-qism: {currentEpisode.title}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-lg">calendar_today</span>
                    {drama.year}
                  </span>
                  <span className="flex items-center gap-1 text-brand-rose">
                    <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    {drama.rating}
                  </span>
                </div>
              </div>
            </div>

            {/* Synopsis & Meta */}
            <section
              className="glass-panel p-6 animate-fade-in-up"
              style={{ animationDelay: "100ms" }}
            >
              <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">info</span>
                Ma&apos;lumot
              </h2>
              <div className="flex flex-wrap items-center gap-6 mb-4 text-sm font-medium">
                <div className="flex items-center gap-2 text-brand-rose">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  {drama.rating} Reyting
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined">calendar_today</span>
                  {drama.year}
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined">public</span>
                  {drama.country}
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined">movie</span>
                  {drama.totalEpisodes} qism
                </div>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                {drama.synopsis}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {drama.genres.map((g: string) => (
                  <span
                    key={g}
                    className="px-3 py-1 rounded-lg bg-surface-container-high text-xs text-text-secondary border border-border-glass"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </section>
          </article>

          {/* Right Column: Episode List */}
          <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
            <div className="glass-panel overflow-hidden sticky top-24 animate-slide-in-right">
              <div className="p-4 bg-surface-container-low border-b border-border-glass flex justify-between items-center">
                <h2 className="font-bold text-on-surface">Qismlar</h2>
                <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded">
                  {drama.episodes.length} qism
                </span>
              </div>
              <div className="flex flex-col max-h-[600px] overflow-y-auto scrollbar-hide">
                {drama.episodes.map((ep: any) => {
                  const isActive = ep.id === currentEpisode.id;
                  return (
                    <Link
                      key={ep.id}
                      href={`/watch/${drama.id}?ep=${ep.id}`}
                      className={`flex items-center gap-4 p-4 border-b border-border-glass/30 transition-premium ${
                        isActive
                          ? "bg-primary/10 border-l-2 border-l-primary"
                          : "hover:bg-surface-variant/50 border-l-2 border-l-transparent"
                      }`}
                    >
                      <div className="relative w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={drama.backdrop}
                          alt={`${drama.title} ${ep.number}-qism`}
                          fill
                          className="object-cover opacity-80"
                          sizes="96px"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white opacity-80">
                            play_circle
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3
                          className={`text-sm font-semibold truncate ${
                            isActive ? "text-primary" : "text-on-surface"
                          }`}
                        >
                          {ep.number}-qism
                        </h3>
                        <p className="text-xs text-text-secondary truncate mt-0.5">
                          {ep.title}
                        </p>
                        <p className="text-xs text-text-secondary/60 mt-1">
                          {ep.duration}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
