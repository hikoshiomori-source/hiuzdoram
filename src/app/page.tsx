import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DoramaCard from "@/components/DoramaCard";
import NeonButton from "@/components/NeonButton";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Fetch dramas with episodes count
  const { data: dbDramas, error } = await supabase
    .from("dramas")
    .select(`
      *,
      episodes (id)
    `)
    .order("created_at", { ascending: false });

  if (error || !dbDramas || dbDramas.length === 0) {
    return (
      <>
        <Navbar />
        <main className="w-full pt-20 bg-[#09090b] min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <p className="text-[#a1a1aa] mb-4">Hali hech qanday dorama yuklanmagan yoki bazaga ulanishda xatolik yuz berdi.</p>
        </main>
        <Footer />
      </>
    );
  }

  // Map to format matching DoramaCard props
  const dramas = dbDramas.map((d: any) => ({
    id: d.id,
    title: d.title,
    titleUz: d.title_uz,
    poster: d.poster_url,
    backdrop: d.backdrop_url,
    year: d.year,
    rating: d.rating,
    genres: Array.isArray(d.genres) ? d.genres : (typeof d.genres === 'string' ? d.genres.replace(/^{|}$/g, '').split(',') : []),
    country: d.country,
    totalEpisodes: d.total_episodes,
    status: d.status,
    synopsis: d.synopsis,
    episodes: d.episodes || [],
    releaseDays: d.release_days,
    releaseTime: d.release_time,
    posterUrl: d.poster_url,
  }));

  const heroDrama = dramas[0];

  return (
    <>
      <Navbar />
      <main className="bg-[#09090b] min-h-screen pb-16">
        
        {/* Cinematic Hero */}
        <section className="relative w-full h-[70vh] min-h-[500px] max-h-[800px] flex items-end pb-12">
          {/* Backdrop Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src={heroDrama.backdrop || heroDrama.poster}
              alt={heroDrama.title}
              fill
              className="object-cover object-top opacity-60"
              priority
            />
            {/* Gradients to fade into background */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-[#09090b]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#09090b] via-[#09090b]/60 to-transparent md:via-transparent" />
          </div>
          
          <div className="relative z-10 w-full max-w-[1440px] mx-auto px-4 md:px-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3 mb-4">
                {heroDrama.rating && (
                  <span className="flex items-center gap-1 bg-[#e11d48] text-white text-xs font-bold px-2 py-1 rounded">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    {heroDrama.rating}
                  </span>
                )}
                <span className="text-[#e4e4e7] text-sm font-medium">{heroDrama.year}</span>
                {heroDrama.genres && heroDrama.genres.length > 0 && (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3f3f46]"></span>
                    <span className="text-[#a1a1aa] text-sm">{heroDrama.genres.slice(0, 3).join(', ')}</span>
                  </>
                )}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {heroDrama.title}
              </h1>
              
              <p className="text-[#a1a1aa] text-base md:text-lg mb-8 line-clamp-3 md:line-clamp-4 max-w-xl">
                {heroDrama.synopsis || "Dorama haqida qisqacha ma'lumot mavjud emas."}
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href={`/watch/${heroDrama.id}`}
                  className="flex items-center gap-2 bg-[#e11d48] hover:bg-[#be123c] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  Tomosha Qilish
                </Link>
                <Link
                  href={`/watch/${heroDrama.id}`}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-lg font-semibold transition-colors border border-white/10"
                >
                  <span className="material-symbols-outlined">info</span>
                  Batafsil
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[1440px] mx-auto px-4 md:px-8 mt-12 space-y-16">
          
          {/* Trending Now */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Top Reyting
                <span className="material-symbols-outlined text-[#e11d48]">local_fire_department</span>
              </h2>
              <Link href="/top-100" className="text-sm font-medium text-[#e11d48] hover:text-[#be123c] transition-colors flex items-center gap-1">
                Hammasini ko'rish <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
              {dramas.slice(0, 7).map((drama: any, i: number) => (
                <DoramaCard key={`trend-${drama.id}`} drama={drama} index={i} />
              ))}
            </div>
          </section>

          {/* New Releases */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                Yangi Qo'shilganlar
              </h2>
              <Link href="/browse" className="text-sm font-medium text-[#e11d48] hover:text-[#be123c] transition-colors flex items-center gap-1">
                Katalog <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
              {dramas.slice(0, 14).map((drama: any, i: number) => (
                <DoramaCard key={`new-${drama.id}`} drama={drama} index={i} />
              ))}
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
