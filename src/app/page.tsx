import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DoramaCard from "@/components/DoramaCard";
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
              Baza bo&apos;sh. Hech qanday dorama topilmadi!
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
    episodes: d.episodes || [],
    releaseDays: d.release_days,
    releaseTime: d.release_time,
    posterUrl: d.poster_url,
  }));

  const heroDrama = dramas[0];
  const topWeekly = dramas.slice(0, 4);

  // Build today's broadcast schedule
  const weekDayNames = ["Yakshanba", "Dushanba", "Seshanba", "Chorshanba", "Payshanba", "Juma", "Shanba"];
  const todayIndex = new Date().getDay();
  const todayName = weekDayNames[todayIndex];

  const todaySchedule = dramas.filter((d: any) => {
    const daysArray = Array.isArray(d.releaseDays)
      ? d.releaseDays
      : (typeof d.releaseDays === 'string' ? d.releaseDays.replace(/^{|}$/g, '').split(',') : []);
    return daysArray.includes(todayName);
  });

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

          {/* Animated Orbs */}
          <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-orb-float z-[1]" />
          <div className="absolute bottom-40 left-[40%] w-48 h-48 bg-brand-rose/5 rounded-full blur-3xl animate-orb-float z-[1]" style={{ animationDelay: "3s" }} />

          <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-4 animate-fade-in-up">
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
            <h1 className="text-3xl md:text-5xl font-extrabold text-on-surface max-w-3xl drop-shadow-lg leading-tight tracking-tight animate-text-glow">
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
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-inverse-primary hover:from-inverse-primary hover:to-primary text-on-primary px-6 md:px-8 py-3 md:py-4 rounded-full font-semibold transition-premium shadow-[0_0_20px_rgba(210,187,255,0.4)] hover:shadow-[0_0_30px_rgba(210,187,255,0.6)] hover:scale-105"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_arrow
                </span>
                Ko&apos;rish
              </Link>
              <button className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-surface-glass border border-border-glass text-on-surface hover:bg-surface-variant transition-premium backdrop-blur-md hover:scale-110">
                <span className="material-symbols-outlined">bookmark_add</span>
              </button>
            </div>
          </div>
        </section>

        {/* ═══ Content Grid ═══ */}
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-12 grid grid-cols-1 xl:grid-cols-12 gap-12 relative z-20">
          {/* Left: Dramas Grid */}
          <div className="xl:col-span-9 flex flex-col gap-12">
            {/* Broadcast Schedule — replaces filter bar */}
            <div className="glass-panel p-5 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">live_tv</span>
                  Bugungi Efir
                  <span className="px-2 py-0.5 rounded-full bg-primary/15 text-primary text-xs font-semibold animate-pulse-glow ml-1">
                    {todayName}
                  </span>
                </h2>
                <Link
                  href="/schedule"
                  className="flex items-center gap-1 text-sm text-primary hover:text-primary-fixed transition-premium font-medium"
                >
                  To&apos;liq jadval
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </Link>
              </div>

              {todaySchedule.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {todaySchedule.map((drama: any, i: number) => (
                    <Link
                      key={drama.id}
                      href={`/watch/${drama.id}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/50 hover:bg-surface-container-high border border-transparent hover:border-border-glass transition-premium group animate-fade-in-up"
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 relative bg-surface-container">
                        <Image
                          src={drama.posterUrl || "/placeholder.jpg"}
                          alt={drama.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-premium">
                          {drama.title}
                        </h3>
                        <p className="text-xs text-text-secondary mt-0.5">
                          {drama.episodes?.length ? drama.episodes.length + 1 : 1}-qism • {drama.releaseTime || '21:00'}
                        </p>
                      </div>
                      <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-xl transition-premium">
                        chevron_right
                      </span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3 py-6 justify-center text-text-secondary">
                  <span className="material-symbols-outlined text-2xl text-surface-bright">event_busy</span>
                  <p className="text-sm">Bugun yangi epizod efirga chiqmaydi</p>
                </div>
              )}
            </div>

            {/* Section Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">video_library</span>
                Barcha Doramalar
              </h2>
              <Link
                href="/browse"
                className="flex items-center gap-1 text-sm text-primary hover:text-primary-fixed transition-premium font-medium"
              >
                Barchasini ko&apos;rish
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
              {dramas.map((drama: any, i: number) => (
                <DoramaCard key={drama.id} drama={drama} index={i} />
              ))}
            </div>
          </div>

          {/* Right: Sidebar */}
          <aside className="xl:col-span-3 flex flex-col gap-8">
            {/* Top 10 Weekly */}
            <div className="glass-panel p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-orb-float" />
              <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">trending_up</span>
                Top 10 Haftalik
              </h2>
              <div className="flex flex-col gap-4">
                {topWeekly.map((drama: any, i: number) => (
                  <Link
                    key={drama.id}
                    href={`/watch/${drama.id}`}
                    className="flex items-center gap-4 group cursor-pointer p-2 -mx-2 rounded-xl hover:bg-surface-container-high transition-premium animate-slide-in-right"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <span className="text-3xl font-extrabold text-surface-bright group-hover:text-primary transition-premium w-8 text-center italic">
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
                      <h4 className="font-semibold text-sm text-on-surface truncate group-hover:text-primary transition-premium">
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
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
