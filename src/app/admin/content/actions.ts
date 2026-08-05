"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function saveDramaAction(data: any) {
  const supabase = createAdminClient();

  // Create slug from title, OR use the existing id if we are editing
  const slug = data.id || data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  try {
    // 1. Upsert Drama (Insert if new, Update if exists)
    const { error: dramaError } = await supabase.from("dramas").upsert({
      id: slug,
      title: data.title,
      synopsis: data.synopsis,
      genres: data.genres,
      country: data.country,
      total_episodes: parseInt(data.totalEpisodes) || 0,
      poster_url: data.posterUrl,
      backdrop_url: data.backdropUrl,
      status: "Published",
      rating: parseFloat(data.rating) || 0.0,
      release_days: data.releaseDays,
      release_time: data.releaseTime,
    });

    if (dramaError) {
      // If it fails because columns don't exist, try again without them
      console.error("Error upserting drama (maybe columns missing):", dramaError);
      
      const fallbackInsert = await supabase.from("dramas").upsert({
        id: slug,
        title: data.title,
        synopsis: data.synopsis,
        genres: data.genres,
        country: data.country,
        total_episodes: parseInt(data.totalEpisodes) || 0,
        poster_url: data.posterUrl,
        backdrop_url: data.backdropUrl,
        status: "Published",
        rating: parseFloat(data.rating) || 0.0,
      });

      if (fallbackInsert.error) {
        throw fallbackInsert.error;
      }
    }

    // 2. Sync Episodes (Delete all existing and insert new ones)
    // Only do this if we are editing an existing drama or if it has episodes
    await supabase.from("episodes").delete().eq("drama_id", slug);

    if (data.episodes && data.episodes.length > 0) {
      const episodesToInsert = data.episodes.map((ep: any) => ({
        id: `${slug}-ep${ep.number}`,
        drama_id: slug,
        episode_number: parseInt(ep.number),
        title: ep.title,
        mover_embed_url: ep.moverUrl,
        duration: ep.duration,
      }));

      const { error: epError } = await supabase.from("episodes").insert(episodesToInsert);
      if (epError) throw epError;
    }

    // Revalidate the cache
    revalidatePath("/");
    revalidatePath("/browse");
    revalidatePath("/admin/content");

    return { success: true };
  } catch (error: any) {
    console.error("Save Drama Error:", error);
    return { error: error.message };
  }
}

export async function deleteDramaAction(dramaId: string) {
  const supabase = createAdminClient();
  try {
    const { error } = await supabase.from("dramas").delete().eq("id", dramaId);
    if (error) throw error;
    
    revalidatePath("/");
    revalidatePath("/browse");
    revalidatePath("/admin/content");
    
    return { success: true };
  } catch (error: any) {
    console.error("Delete Drama Error:", error);
    return { error: error.message };
  }
}

export async function getEpisodesAction(dramaId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase.from("episodes").select("*").eq("drama_id", dramaId).order("episode_number", { ascending: true });
  if (error) {
    return { error: error.message };
  }
  return { episodes: data };
}
