import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientBrowse from "./ClientBrowse";
import { createClient } from "@supabase/supabase-js";

export const revalidate = 60; // ISR cache

export default async function BrowsePage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: dbDramas, error } = await supabase
    .from("dramas")
    .select(`
      *,
      episodes (id)
    `)
    .order("created_at", { ascending: false });

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
  }));

  return (
    <>
      <Navbar />
      <main className="w-full pt-16 md:pt-20 bg-background min-h-screen">
        <ClientBrowse dramas={dramas} />
      </main>
      <Footer />
    </>
  );
}
