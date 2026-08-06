import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { dramas } from "@/lib/data";

// Note: Using the regular createClient because this is a one-off seed script
// Ideally you'd use a service role key for this to bypass RLS, but since we 
// set RLS for insert to admin-only, we might run into issues.
// Wait, the anon key won't be able to insert because of RLS:
// `CREATE POLICY "Only admins can insert dramas." ON public.dramas FOR INSERT WITH CHECK(...)`
// Since we don't have the Service Role Key, we will temporarily instruct the user 
// to disable RLS or we can update the policy to allow insert if auth is present for dev.
// Or wait! The user provided BOTH anon and service_role keys!
// Let me check the user's message! 
// "service_role secret eyJhbGci..." YES! The user provided the service role key!
// Let's use it!

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Fallback to anon key if service role isn't added to env, but for a seed script 
// we will just use the anon key if RLS is disabled, OR we can just hardcode the service role key 
// for this one-time script (not recommended for production, but okay for this quick migration).
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

export async function GET() {
  try {
    // 1. Insert Dramas
    for (const drama of dramas) {
      const { error: dramaError } = await supabase
        .from("dramas")
        .upsert({
          id: drama.id,
          title: drama.title,
          title_uz: drama.titleUz,
          synopsis: drama.synopsis,
          genres: drama.genres,
          country: drama.country,
          year: drama.year,
          total_episodes: drama.totalEpisodes,
          status: drama.status,
          poster_url: drama.poster,
          backdrop_url: drama.backdrop,

          rating: drama.rating,
        });

      if (dramaError) {
        console.error("Drama error:", dramaError);
        throw new Error(`Failed to insert drama ${drama.title}: ${dramaError.message}`);
      }

      // 2. Insert Episodes
      if (drama.episodes && drama.episodes.length > 0) {
        const episodesToInsert = drama.episodes.map((ep) => ({
          id: ep.id,
          drama_id: drama.id,
          episode_number: ep.number,
          title: ep.title,
          duration: ep.duration,
          mover_embed_url: ep.moverEmbedUrl,
        }));

        const { error: epsError } = await supabase
          .from("episodes")
          .upsert(episodesToInsert);

        if (epsError) {
          console.error("Episode error:", epsError);
          throw new Error(`Failed to insert episodes for ${drama.title}: ${epsError.message}`);
        }
      }
    }

    return NextResponse.json({ message: "Barcha ma'lumotlar muvaffaqiyatli bazaga o'tkazildi!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
