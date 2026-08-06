import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Efir Jadvali — Haftalik yangi dorama epizodlari | hiuzdoram",
  description:
    "Haftalik dorama efir jadvali. Qaysi kuni qaysi serial yangi qism chiqishini bilib oling — hiuzdoram platformasida.",
  alternates: {
    canonical: "https://hiuzdoram.site/schedule",
  },
  openGraph: {
    title: "Efir Jadvali — hiuzdoram",
    description: "Haftalik yangi epizodlar jadvali.",
    type: "website",
    siteName: "hiuzdoram",
  },
};

export const revalidate = 60;

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
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  // Vercel server is UTC, so we get approx day (0 = Sun, 1 = Mon)
  const todayIndex = new Date().getDay();
  // Map to our array index: 0 = Mon, 6 = Sun
  const todayMapped = todayIndex === 0 ? 6 : todayIndex - 1;

  const { data: dbDramas } = await supabase
    .from("dramas")
    .select(`
      id, title, poster_url, release_days, release_time,
      episodes (id)
    `);

  const dramas = dbDramas || [];

  const schedule = weekDays.map((wd, i) => {
    const dayDramas = dramas.filter(d => {
      const daysArray = Array.isArray(d.release_days) 
        ? d.release_days 
        : (typeof d.release_days === 'string' ? d.release_days.replace(/^{|}$/g, '').split(',') : []);
      return daysArray.includes(wd.day);
    });

    return {
      ...wd,
      isToday: i === todayMapped,
      dramas: dayDramas,
    };
  });

  return (
    <>
      <Navbar />
      <main className="w-full pt-24 bg-[#09090b] min-h-screen pb-24">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#e11d48] text-3xl">calendar_month</span>
              Efir Jadvali
            </h1>
            <p className="text-[#a1a1aa] text-sm max-w-2xl">
              Hafta davomida qaysi kuni qaysi dorama chiqishini kuzatib boring.
            </p>
          </div>

          {/* Week Grid */}
          <div className="flex flex-col gap-6">
            {schedule.map((day, index) => (
              <div
                key={day.day}
                className={`p-6 rounded-xl border transition-colors ${
                  day.isToday
                    ? "bg-[#18181b] border-[#e11d48]"
                    : "bg-[#09090b] border-[#27272a]"
                }`}
              >
                <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#27272a]">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold ${
                      day.isToday
                        ? "bg-[#e11d48] text-white"
                        : "bg-[#27272a] text-[#a1a1aa]"
                    }`}
                  >
                    {day.short}
                  </div>
                  <h2 className="text-xl font-bold text-white">{day.day}</h2>
                  {day.isToday && (
                    <span className="ml-auto px-3 py-1 bg-[#e11d48]/20 text-[#e11d48] text-xs font-bold rounded-md uppercase tracking-wider flex items-center gap-1.5 border border-[#e11d48]/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48] animate-pulse"></span>
                      Bugun
                    </span>
                  )}
                </div>

                {day.dramas.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {day.dramas.map((drama) => (
                      <Link
                        key={drama.id}
                        href={`/watch/${drama.id}`}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#27272a] border border-transparent hover:border-[#3f3f46] transition-colors group"
                      >
                        <div className="w-16 h-24 rounded-md overflow-hidden shrink-0 relative bg-black">
                          <Image
                            src={drama.poster_url || "/placeholder.jpg"}
                            alt={drama.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-[#e4e4e7] truncate group-hover:text-[#e11d48] transition-colors">
                            {drama.title}
                          </h3>
                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs bg-[#27272a] text-[#a1a1aa] px-2 py-1 rounded">
                              {drama.episodes?.length ? drama.episodes.length + 1 : 1}-qism kutilmoqda
                            </span>
                          </div>
                          <p className="text-xs text-[#71717a] mt-1">
                            Soat {drama.release_time || '21:00'} da
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center p-8 border border-dashed border-[#27272a] rounded-lg">
                    <p className="text-[#71717a] text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">block</span>
                      Bu kunga rejalashtirilgan dorama yo'q
                    </p>
                  </div>
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
