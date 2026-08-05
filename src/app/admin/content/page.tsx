import { createAdminClient } from "@/lib/supabase/admin";
import ContentClient from "./ContentClient";

export default async function ContentPage() {
  const supabase = createAdminClient();
  
  const { data: dramas, error } = await supabase
    .from("dramas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching admin dramas:", error);
  }

  return <ContentClient initialDramas={dramas || []} />;
}
