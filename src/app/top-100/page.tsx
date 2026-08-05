import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function Top100Page() {
  const supabase = await createClient();

  const { data: dbDramas, error } = await supabase
    .from("dramas")
    .select("*")
    .order("rating", { ascending: false })
    .limit(100);

  if (error || !dbDramas) {
    return (
      <>
        <Navbar />
        <main className="w-full pt-16 md:pt-20 bg-background min-h-screen flex items-center justify-center">
          <p className="text-on-surface-variant">Ma'lumotlarni yuklashda xatolik yuz berdi.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen">
        <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span
                className="material-symbols-outlined text-4xl text-brand-rose"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                trophy
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-on-surface tracking-tight">
              Top 100 Doramalar
            </h1>
            <p className="text-on-surface-variant mt-2">
              Foydalanuvchilar tomonidan eng yuqori baholangan seriallar
            </p>
          </div>

          {/* List */}
          <div className="flex flex-col gap-3">
            {dbDramas.map((drama, i) => (
              <Link
                key={drama.id}
                href={`/watch/${drama.id}`}
                className="flex items-center gap-4 md:gap-6 p-4 rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low border border-transparent hover:border-border-glass transition-all group"
              >
                {/* Rank */}
                <span
                  className={`text-3xl md:text-4xl font-black italic w-12 text-center flex-shrink-0 ${
                    i === 0
                      ? "text-brand-rose"
                      : i === 1
                      ? "text-primary"
                      : i === 2
                      ? "text-tertiary"
                      : "text-surface-bright"
                  } group-hover:scale-110 transition-transform`}
                >
                  {i + 1}
                </span>

                {/* Poster */}
                <div className="w-16 h-24 md:w-20 md:h-28 rounded-xl overflow-hidden flex-shrink-0 relative shadow-lg">
                  <Image
                    src={drama.poster_url}
                    alt={drama.title}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-base md:text-lg font-bold text-on-surface truncate group-hover:text-primary transition-colors">
                    {drama.title}
                  </h3>
                  <p className="text-xs md:text-sm text-text-secondary mt-0.5">
                    {(Array.isArray(drama.genres) ? drama.genres : (typeof drama.genres === 'string' ? drama.genres.replace(/^{|}$/g, '').split(',') : [])).join(", ")} • {drama.year}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-text-secondary">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-base">visibility</span>
                      {drama.views}
                    </span>
                    <span>{drama.total_episodes} qism</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        drama.status === "Completed"
                          ? "bg-success/20 text-success"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {drama.status === "Completed" ? "Tugallangan" : "Davom etmoqda"}
                    </span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="flex items-center gap-1 text-brand-rose">
                    <span
                      className="material-symbols-outlined text-2xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="text-xl font-bold">{drama.rating}</span>
                  </div>
                  <span className="text-xs text-text-secondary">reyting</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
