import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DoramaCard from "@/components/DoramaCard";
import { IMAGES } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const supabase = await createClient();

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
        <main className="w-full pt-20 bg-background min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <p className="text-on-surface-variant mb-4">Hali hech qanday dorama yuklanmagan yoki bazaga ulanishda xatolik yuz berdi.</p>
          {error && (
            <div className="bg-error/10 text-error p-4 rounded-xl max-w-lg overflow-auto text-sm text-left">
              <strong>Xatolik tafsilotlari:</strong><br/>
              {error.message || JSON.stringify(error)}
            </div>
          )}
          {(!dbDramas || dbDramas.length === 0) && !error && (
            <div className="bg-primary/10 text-primary p-4 rounded-xl max-w-lg text-sm mt-4">
              Baza bo'sh. Hech qanday dorama topilmadi!
            </div>
          )}
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
    views: d.views,
    episodes: d.episodes || [], // Just need the length for the card
  }));

  const heroDrama = dramas[0];
  const topWeekly = dramas.slice(0, 4);

  return (
    <>
      <Navbar />
      <main className="w-full pt-16 md:pt-20 bg-background">
        {/* ═══ Hero Section ═══ */}
        <section className="relative w-full h-[70vh] md:h-[80vh] flex items-end pb-12 md:pb-16 pt-32 px-4 md:px-6 overflow-hidden group">
          {/* Backdrop */}
          <div
            className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style={{ backgroundImage: `url('${heroDrama.backdrop}')` }}
          />
          {/* Gradients */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-background via-background/50 to-transparent w-2/3" />

          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-4">
            {/* Badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold border border-primary/30 backdrop-blur-md">
                4K Ultra HD
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-glass text-on-surface-variant text-xs font-semibold border border-border-glass backdrop-blur-md">
                SoftBox Exclusive
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-brand-rose/20 text-brand-rose text-xs font-semibold border border-brand-rose/30 backdrop-blur-md">
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
                {heroDrama.rating}/10
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface max-w-3xl drop-shadow-lg leading-tight tracking-tight">
              {heroDrama.title}
            </h1>
            <div className="flex items-center gap-4 text-on-surface-variant text-sm font-semibold flex-wrap">
              <span>{heroDrama.year}</span>
              <span className="w-1 h-1 rounded-full bg-outline" />
              <span>{heroDrama.totalEpisodes} Episodes</span>
              <span className="w-1 h-1 rounded-full bg-outline" />
              <span>{heroDrama.genres.join(", ")}</span>
            </div>
            <p className="text-base md:text-lg text-on-surface-variant max-w-2xl mt-1 line-clamp-3 drop-shadow-md">
              {heroDrama.synopsis}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-4 mt-4">
              <Link
                href={`/watch/${heroDrama.id}`}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-inverse-primary hover:from-inverse-primary hover:to-primary text-on-primary px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(210,187,255,0.4)] hover:shadow-[0_0_30px_rgba(210,187,255,0.6)] hover:scale-105"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_arrow
                </span>
                Ko&apos;rish
              </Link>
              <button className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-surface-glass border border-border-glass text-on-surface hover:bg-surface-variant transition-colors backdrop-blur-md">
                <span className="material-symbols-outlined">bookmark_add</span>
              </button>
            </div>
          </div>
        </section>

        {/* ═══ Content Grid ═══ */}
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-12 grid grid-cols-1 xl:grid-cols-12 gap-12 relative z-20">
          {/* Left: Dramas Grid */}
          <div className="xl:col-span-9 flex flex-col gap-12">
            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-surface-container-low/50 p-4 rounded-2xl backdrop-blur-md border border-border-glass">
              <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 md:pb-0 scrollbar-hide">
                {["Hammasi", "Koreya", "Yaponiya", "Xitoy"].map((region, i) => (
                  <button
                    key={region}
                    className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-colors ${
                      i === 0
                        ? "bg-primary text-on-primary shadow-[0_0_15px_rgba(210,187,255,0.3)]"
                        : "bg-surface-container-high hover:bg-surface-variant text-on-surface-variant hover:text-on-surface"
                    }`}
                  >
                    {region}
                  </button>
                ))}
                <div className="w-px h-6 bg-border-glass mx-2" />
                <button className="px-4 py-2 rounded-full bg-surface-container-high hover:bg-surface-variant text-on-surface-variant flex items-center gap-1 text-sm font-semibold whitespace-nowrap transition-colors">
                  Janr <span className="material-symbols-outlined text-lg">keyboard_arrow_down</span>
                </button>
              </div>
              <button className="flex items-center gap-2 text-on-surface-variant hover:text-primary text-sm font-semibold transition-colors flex-shrink-0">
                <span className="material-symbols-outlined text-xl">sort</span>
                Trending
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
              {dramas.map((drama, i) => (
                <DoramaCard key={drama.id} drama={drama} index={i} />
              ))}
            </div>
          </div>

          {/* Right: Sidebar */}
          <aside className="xl:col-span-3 flex flex-col gap-8">
            {/* Top 10 Weekly */}
            <div className="bg-surface-container/40 border border-border-glass rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">trending_up</span>
                Top 10 Haftalik
              </h2>
              <div className="flex flex-col gap-4">
                {topWeekly.map((drama, i) => (
                  <Link
                    key={drama.id}
                    href={`/watch/${drama.id}`}
                    className="flex items-center gap-4 group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-surface-container-high transition-colors"
                  >
                    <span className="text-3xl font-extrabold text-surface-bright group-hover:text-primary transition-colors w-8 text-center italic">
                      {i + 1}
                    </span>
                    <div className="w-14 h-20 rounded-lg overflow-hidden flex-shrink-0 relative">
                      <Image
                        src={drama.poster}
                        alt={drama.title}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-on-surface truncate group-hover:text-primary transition-colors">
                        {drama.title}
                      </h4>
                      <p className="text-xs text-text-secondary">{drama.genres.slice(0, 2).join(", ")}</p>
                      <div className="flex items-center gap-1 mt-1 text-brand-rose">
                        <span
                          className="material-symbols-outlined text-sm"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                        <span className="text-xs font-medium">{drama.rating}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* VIP CTA */}
            <div className="bg-gradient-to-br from-inverse-primary/30 to-primary-container/20 border border-primary/20 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/30 rounded-full blur-2xl" />
              <span
                className="material-symbols-outlined text-4xl text-primary mb-3"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                workspace_premium
              </span>
              <h3 className="text-lg font-bold text-on-surface mb-2">VIP Obuna</h3>
              <p className="text-sm text-on-surface-variant mb-4">
                Reklamasiz, 4K sifatda va eng birinchi bo&apos;lib yangi epizodlarni ko&apos;ring.
              </p>
              <button className="w-full py-2.5 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-full text-sm font-semibold hover:shadow-[0_0_20px_rgba(210,187,255,0.4)] transition-all hover:scale-[1.02]">
                Obuna bo&apos;lish
              </button>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
