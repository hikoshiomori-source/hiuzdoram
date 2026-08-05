import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const dynamic = 'force-dynamic';

const weekDays = [
  { day: "Dushanba", short: "Du" },
  { day: "Seshanba", short: "Se" },
  { day: "Chorshanba", short: "Cho" },
  { day: "Payshanba", short: "Pa" },
  { day: "Juma", short: "Ju" },
  { day: "Shanba", short: "Sha" },
  { day: "Yakshanba", short: "Ya" },
];

export default async function SchedulePage() {
  const supabase = await createClient();
  
  // Vercel server is UTC, so we get approx day (0 = Sun, 1 = Mon)
  const todayIndex = new Date().getDay();
  // Map to our array index: 0 = Mon, 6 = Sun
  const todayMapped = todayIndex === 0 ? 6 : todayIndex - 1;

  const { data: dbDramas } = await supabase
    .from("dramas")
    .select(`
      id, title, poster_url, release_days, release_time,
      episodes (id)
    `)
    .eq('status', 'Ongoing');

  const dramas = dbDramas || [];

  const schedule = weekDays.map((wd, i) => {
    const dayDramas = dramas.filter(d => 
      Array.isArray(d.release_days) && d.release_days.includes(wd.day)
    );

    return {
      ...wd,
      isToday: i === todayMapped,
      dramas: dayDramas,
    };
  });

  return (
    <>
      <Navbar />
      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-4xl">calendar_month</span>
              Efir Jadvali
            </h1>
            <p className="text-on-surface-variant mt-2">
              Haftalik yangi epizodlar jadvali
            </p>
          </div>

          {/* Week Grid */}
          <div className="flex flex-col gap-4">
            {schedule.map((day) => (
              <div
                key={day.day}
                className={`p-4 md:p-6 rounded-2xl border transition-all ${
                  day.isToday
                    ? "bg-primary/5 border-primary/30 ring-1 ring-primary/20"
                    : "bg-surface-container-lowest border-border-glass hover:bg-surface-container-low"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${
                      day.isToday
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-high text-on-surface-variant"
                    }`}
                  >
                    {day.short}
                  </div>
                  <h2 className="text-lg font-bold text-on-surface">{day.day}</h2>
                  {day.isToday && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-semibold animate-pulse-glow">
                      Bugun
                    </span>
                  )}
                </div>

                {day.dramas.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {day.dramas.map((drama) => (
                      <Link
                        key={drama.id}
                        href={`/watch/${drama.id}`}
                        className="flex items-center gap-3 p-3 rounded-xl bg-surface-container/50 hover:bg-surface-container-high border border-transparent hover:border-border-glass transition-all group"
                      >
                        <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 relative">
                          <Image
                            src={drama.poster_url || "/placeholder.jpg"}
                            alt={drama.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">
                            {drama.title}
                          </h3>
                          <p className="text-xs text-text-secondary mt-0.5">
                            {drama.episodes?.length ? drama.episodes.length + 1 : 1}-qism • {drama.release_time || '21:00'}
                          </p>
                        </div>
                        <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-xl transition-colors">
                          chevron_right
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-text-secondary italic">Bugun yangi epizod yo&apos;q</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
