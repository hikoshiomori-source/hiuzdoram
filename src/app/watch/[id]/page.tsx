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
      <main className="w-full pt-20 bg-[#09090b] min-h-screen pb-16">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Video & Info */}
          <article className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            
            {/* Player Container */}
            <div className="w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-[#27272a] aspect-video flex flex-col">
              <MoverPlayer
                key={currentEpisode.id}
                embedUrl={currentEpisode.moverEmbedUrl}
                title={`${drama.title} — ${currentEpisode.number}-qism`}
              />
            </div>

            {/* Title & Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {drama.title} <span className="text-[#a1a1aa] text-lg font-normal">({drama.year})</span>
                </h1>
                <p className="text-[#e11d48] font-medium">
                  {currentEpisode.number}-qism: {currentEpisode.title}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 bg-[#27272a] hover:bg-[#3f3f46] text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm">
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  Ro'yxatga qo'shish
                </button>
                <button className="flex items-center justify-center w-10 h-10 bg-[#27272a] hover:bg-[#3f3f46] text-white rounded-lg transition-colors">
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </button>
              </div>
            </div>

            {/* Synopsis & Meta */}
            <section className="bg-[#18181b] p-6 rounded-xl border border-[#27272a]">
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm font-medium text-[#a1a1aa]">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">public</span>
                  {drama.country}
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[18px]">movie</span>
                  {drama.totalEpisodes} Qism
                </div>
                <div className="flex items-center gap-1 text-[#e11d48]">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  {drama.rating}
                </div>
              </div>
              
              <p className="text-sm text-[#e4e4e7] leading-relaxed mb-6">
                {drama.synopsis}
              </p>
              
              <div className="flex flex-wrap gap-2">
                {drama.genres.map((g: string) => (
                  <Link href={`/browse?genre=${g}`} key={g} className="px-3 py-1 bg-[#27272a] hover:bg-[#3f3f46] text-[#a1a1aa] hover:text-white rounded-md text-xs font-medium transition-colors">
                    {g}
                  </Link>
                ))}
              </div>
            </section>
          </article>

          {/* Right Column: Episode List */}
          <aside className="lg:col-span-4 xl:col-span-3">
            <div className="bg-[#18181b] rounded-xl border border-[#27272a] overflow-hidden sticky top-24 max-h-[calc(100vh-120px)] flex flex-col">
              <div className="p-4 bg-[#27272a]/50 border-b border-[#27272a] flex justify-between items-center shrink-0">
                <h2 className="text-lg font-bold text-white">Qismlar ro'yxati</h2>
                <span className="text-xs font-bold bg-[#e11d48] text-white px-2 py-1 rounded">
                  {drama.episodes.length} QISM
                </span>
              </div>
              
              <div className="flex-1 overflow-y-auto scrollbar-hide p-3 space-y-2">
                {drama.episodes.map((ep: any) => {
                  const isActive = ep.id === currentEpisode.id;
                  return (
                    <Link
                      key={ep.id}
                      href={`/watch/${drama.id}?ep=${ep.id}`}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#27272a] border border-[#3f3f46]"
                          : "hover:bg-[#27272a]/50 border border-transparent"
                      }`}
                    >
                      <div className="relative w-24 h-[54px] rounded overflow-hidden shrink-0 bg-black">
                        <Image
                          src={drama.backdrop || drama.poster}
                          alt={`${drama.title} ${ep.number}-qism`}
                          fill
                          className={`object-cover ${isActive ? 'opacity-50' : 'opacity-80'}`}
                          sizes="96px"
                        />
                        {isActive && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-white">play_arrow</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="min-w-0">
                        <h3
                          className={`text-sm font-semibold truncate ${
                            isActive ? "text-[#e11d48]" : "text-[#e4e4e7]"
                          }`}
                        >
                          {ep.number}-qism
                        </h3>
                        <p className="text-xs text-[#a1a1aa] truncate mt-0.5">
                          {ep.title}
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
