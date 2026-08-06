import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Top 100 Doramalar — Eng yaxshi koreyscha seriallar reytingi | hiuzdoram",
  description:
    "Foydalanuvchilar tomonidan eng yuqori baholangan 100 ta dorama. Koreys, yapon va xitoy seriallarining to'liq reytingi — hiuzdoram platformasida.",
  alternates: {
    canonical: "https://hiuzdoram.site/top-100",
  },
  openGraph: {
    title: "Top 100 Doramalar — hiuzdoram",
    description: "Eng yuqori baholangan 100 ta doramalar reytingi.",
    type: "website",
    siteName: "hiuzdoram",
  },
};

export default async function Top100Page() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: dbDramas, error } = await supabase
    .from("dramas")
    .select("*")
    .order("rating", { ascending: false })
    .limit(100);

  if (error || !dbDramas) {
    return (
      <>
        <Navbar />
        <main className="w-full pt-20 bg-[#09090b] min-h-screen flex items-center justify-center">
          <p className="text-[#a1a1aa]">Ma&apos;lumotlarni yuklashda xatolik yuz berdi.</p>
        </main>
        <Footer />
      </>
    );
  }

  // Schema.org ItemList
  const schemaJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top 100 Doramalar",
    description: "Foydalanuvchilar tomonidan eng yuqori baholangan 100 ta dorama reytingi",
    numberOfItems: dbDramas.length,
    itemListElement: dbDramas.map((drama: any, i: number) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "TVSeries",
        name: drama.title,
        url: `https://hiuzdoram.site/watch/${drama.id}`,
        image: drama.poster_url,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: drama.rating,
          bestRating: 10,
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />
      <Navbar />
      <main className="w-full pt-24 bg-[#09090b] min-h-screen pb-24">
        <div className="max-w-[1000px] mx-auto px-4 md:px-8">
          
          {/* Header */}
          <header className="mb-12 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                Global Top 100
                <span className="material-symbols-outlined text-[#e11d48] text-3xl">trophy</span>
              </h1>
              <p className="text-[#a1a1aa] text-sm">
                Eng yuqori baholangan doramalar reytingi.
              </p>
            </div>
          </header>

          {/* List */}
          <div className="flex flex-col gap-4">
            {dbDramas.map((drama: any, i: number) => {
              const genres = Array.isArray(drama.genres)
                ? drama.genres
                : typeof drama.genres === "string"
                ? drama.genres.replace(/^{|}$/g, "").split(",")
                : [];

              return (
                <Link
                  key={drama.id}
                  href={`/watch/${drama.id}`}
                  className="flex items-center gap-4 md:gap-6 p-4 rounded-xl bg-[#18181b] border border-[#27272a] hover:bg-[#27272a] transition-colors group"
                >
                  {/* Rank */}
                  <div className="w-8 md:w-12 text-center shrink-0">
                    <span
                      className={`text-2xl md:text-3xl font-bold italic ${
                        i === 0
                          ? "text-[#fbbf24]" // Gold
                          : i === 1
                          ? "text-[#94a3b8]" // Silver
                          : i === 2
                          ? "text-[#b45309]" // Bronze
                          : "text-[#52525b]"
                      }`}
                    >
                      {i + 1}
                    </span>
                  </div>

                  {/* Poster */}
                  <div className="w-16 h-24 md:w-20 md:h-28 rounded-md overflow-hidden shrink-0 relative bg-black">
                    <Image
                      src={drama.poster_url}
                      alt={`${drama.title} poster — ${genres.join(", ")} dorama`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 64px, 80px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <h2 className="text-lg font-bold text-[#e4e4e7] truncate group-hover:text-[#e11d48] transition-colors">
                      {drama.title}
                    </h2>
                    <p className="text-xs text-[#a1a1aa] mt-1 truncate">
                      {genres.join(", ")} • {drama.year}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] md:text-xs font-semibold">
                      <span className="bg-[#27272a] text-[#e4e4e7] px-2 py-1 rounded">
                        {drama.total_episodes} QISM
                      </span>
                      <span
                        className={`px-2 py-1 rounded ${
                          drama.status === "Completed"
                            ? "bg-[#10b981]/20 text-[#10b981]"
                            : "bg-[#3b82f6]/20 text-[#3b82f6]"
                        }`}
                      >
                        {drama.status === "Completed" ? "Tugallangan" : "Davom etmoqda"}
                      </span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="shrink-0 text-center flex flex-col items-center justify-center bg-[#27272a] group-hover:bg-[#3f3f46] transition-colors w-14 h-14 md:w-16 md:h-16 rounded-lg">
                    <span
                      className="material-symbols-outlined text-[20px] text-[#e11d48] mb-0.5"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                    <span className="text-sm md:text-base font-bold text-white leading-none">{drama.rating}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
