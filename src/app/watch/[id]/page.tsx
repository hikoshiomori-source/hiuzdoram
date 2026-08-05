import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MoverPlayer from "@/components/MoverPlayer";
import { comments, IMAGES } from "@/lib/data"; // we'll keep comments mock for now since it's not strictly requested
import { createClient } from "@/lib/supabase/server";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function WatchPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  const dramaId = resolvedParams.id;
  const currentEpId = typeof resolvedSearchParams.ep === 'string' ? resolvedSearchParams.ep : null;

  const supabase = await createClient();

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
      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          {/* Left Column: Video & Info */}
          <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
            
            {/* Player Container */}
            <div className="w-full bg-surface-base rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-border-glass">
              {/* MoverPlayer takes the embed URL from the DB */}
              <MoverPlayer 
                embedUrl={currentEpisode.moverEmbedUrl} 
                title={`${drama.title} - ${currentEpisode.number}-qism`} 
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
                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface transition-colors">
                    <span className="material-symbols-outlined text-xl">favorite</span>
                    Yoqdi
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface transition-colors">
                    <span className="material-symbols-outlined text-xl">share</span>
                    Ulashish
                  </button>
                </div>
              </div>
            </div>

            {/* Synopsis & Meta */}
            <div className="bg-surface-glass p-6 rounded-2xl backdrop-blur-md border border-border-glass">
              <div className="flex flex-wrap items-center gap-6 mb-4 text-sm font-medium">
                <div className="flex items-center gap-2 text-brand-rose">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  {drama.rating} Reyting
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant">
                  <span className="material-symbols-outlined">visibility</span>
                  {drama.views} Ko'rishlar
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

            {/* Comments Section (Mocked for now) */}
            <div className="bg-surface-glass p-6 rounded-2xl backdrop-blur-md border border-border-glass">
              <h3 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">chat</span>
                Izohlar ({comments.length})
              </h3>
              
              <div className="flex gap-4 mb-8">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-border-glass">
                  <Image src={IMAGES.userAvatar} alt="User" width={40} height={40} className="object-cover" />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Izoh yozish..."
                    className="w-full bg-surface-base border border-border-glass rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:border-primary/50 focus:bg-surface-container-lowest transition-colors"
                  />
                  <div className="flex justify-end mt-2">
                    <button className="px-6 py-2 rounded-full bg-primary text-on-primary text-sm font-semibold hover:bg-primary-container transition-colors shadow-lg">
                      Yuborish
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image src={comment.user.avatar} alt={comment.user.name} width={40} height={40} className="object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-on-surface text-sm">{comment.user.name}</span>
                        <span className="text-xs text-text-secondary">{comment.time}</span>
                      </div>
                      <p className="text-sm text-on-surface-variant mb-2">{comment.text}</p>
                      <button className="flex items-center gap-1 text-xs text-text-secondary hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-base">thumb_up</span>
                        {comment.likes}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Episode List */}
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6">
            <div className="bg-surface-container/50 border border-border-glass rounded-2xl overflow-hidden backdrop-blur-md sticky top-24">
              <div className="p-4 bg-surface-container-low border-b border-border-glass flex justify-between items-center">
                <h3 className="font-bold text-on-surface">Qismlar</h3>
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
                      className={`flex items-center gap-4 p-4 border-b border-border-glass/30 transition-all ${
                        isActive 
                        ? "bg-primary/10 border-l-2 border-l-primary" 
                        : "hover:bg-surface-variant/50 border-l-2 border-l-transparent"
                      }`}
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
