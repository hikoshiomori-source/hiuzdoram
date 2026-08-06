import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MoverPlayer from "@/components/MoverPlayer";
import ViewTracker from "@/components/ViewTracker";
import { createClient } from "@supabase/supabase-js";
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function WatchPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const dramaId = resolvedParams.id;
  const currentEpId = typeof resolvedSearchParams.ep === 'string' ? resolvedSearchParams.ep : null;

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch drama and its episodes
  const { data: dbDrama, error } = await supabase
    .from("dramas")
    .select(`
      *,
      episodes (*)
    `)
    .eq("id", dramaId)
    .single();

  if (error || !dbDrama) {
    notFound();
  }

  // Format to match our UI
  const drama = {
    id: dbDrama.id,
    title: dbDrama.title,
    titleUz: dbDrama.title_uz,
    poster: dbDrama.poster_url,
    backdrop: dbDrama.backdrop_url,
    year: dbDrama.year,
    rating: dbDrama.rating,
    genres: Array.isArray(dbDrama.genres) ? dbDrama.genres : (typeof dbDrama.genres === 'string' ? dbDrama.genres.replace(/^{|}$/g, '').split(',') : []),
    country: dbDrama.country,
    totalEpisodes: dbDrama.total_episodes,
    status: dbDrama.status,
    synopsis: dbDrama.synopsis,
    views: dbDrama.views,
    episodes: (dbDrama.episodes || []).sort((a: any, b: any) => a.episode_number - b.episode_number).map((ep: any) => ({
      id: ep.id,
      number: ep.episode_number,
      title: ep.title,
      moverEmbedUrl: ep.mover_embed_url,
      duration: ep.duration,
    })),
  };

  // Determine current episode
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
          <p className="text-on-surface-variant">Ushbu dorama uchun qismlar topilmadi.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <ViewTracker dramaId={drama.id} />
      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          {/* Left Column: Video & Info */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            
            {/* Player Container */}
            <div className="w-full bg-surface-base rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-border-glass animate-scale-in">
              <MoverPlayer 
                key={currentEpisode.id}
                embedUrl={currentEpisode.moverEmbedUrl} 
                title={`${drama.title} - ${currentEpisode.number}-qism`} 
              />
              
              {/* Player Bottom Bar — Title & Episode info only */}
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
                    <span className="material-symbols-outlined text-lg">visibility</span>
                    {drama.views} ko&apos;rishlar
                  </span>
                </div>
              </div>
            </div>

            {/* Synopsis & Meta */}
            <div className="glass-panel p-6 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              <div className="flex flex-wrap items-center gap-6 mb-4 text-sm font-medium">
                <div className="flex items-center gap-2 text-brand-rose">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  {drama.rating} Reyting
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined">visibility</span>
                  {drama.views} Ko&apos;rishlar
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined">calendar_today</span>
                  {drama.year}
                </div>
              </div>
              <p className="text-on-surface-variant leading-relaxed">
                {drama.synopsis}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {drama.genres.map((g: string) => (
                  <span key={g} className="px-3 py-1 rounded-lg bg-surface-container-high text-xs text-text-secondary border border-border-glass">
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Episode List */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
            <div className="glass-panel overflow-hidden sticky top-24 animate-slide-in-right">
              <div className="p-4 bg-surface-container-low border-b border-border-glass flex justify-between items-center">
                <h3 className="font-bold text-on-surface">Qismlar</h3>
                <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded">
                  {drama.episodes.length} qism
                </span>
              </div>
              <div className="flex flex-col max-h-[600px] overflow-y-auto scrollbar-hide">
                {drama.episodes.map((ep: any, i: number) => {
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
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      <div className="relative w-24 h-16 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={drama.backdrop}
                          alt={ep.title}
                          fill
                          className="object-cover opacity-80"
                          sizes="96px"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="material-symbols-outlined text-white opacity-80">play_circle</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-semibold truncate ${isActive ? "text-primary" : "text-on-surface"}`}>
                          {ep.number}-qism
                        </h4>
                        <p className="text-xs text-text-secondary truncate mt-0.5">{ep.title}</p>
                        <p className="text-xs text-text-secondary/60 mt-1">{ep.duration}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
