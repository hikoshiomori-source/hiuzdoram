import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const BASE_URL = "https://hiuzdoram.site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: dramas } = await supabase
    .from("dramas")
    .select("id, created_at")
    .order("created_at", { ascending: false });

  const dramaEntries: MetadataRoute.Sitemap = (dramas || []).map((drama) => ({
    url: `${BASE_URL}/watch/${drama.id}`,
    lastModified: new Date(drama.created_at),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/browse`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/top-100`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/schedule`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    ...dramaEntries,
  ];
}
