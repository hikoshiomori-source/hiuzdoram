import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  try {
    const { dramaId } = await request.json();

    if (!dramaId || typeof dramaId !== "string") {
      return NextResponse.json({ error: "Invalid dramaId" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Get current views
    const { data: drama } = await supabase
      .from("dramas")
      .select("views")
      .eq("id", dramaId)
      .single();

    if (!drama) {
      return NextResponse.json({ error: "Drama not found" }, { status: 404 });
    }

    // Parse current views (could be "2.4M", "900K", or a number)
    let currentViews = 0;
    const viewsStr = String(drama.views || "0");
    if (viewsStr.endsWith("M")) {
      currentViews = Math.round(parseFloat(viewsStr) * 1000000);
    } else if (viewsStr.endsWith("K")) {
      currentViews = Math.round(parseFloat(viewsStr) * 1000);
    } else {
      currentViews = parseInt(viewsStr, 10) || 0;
    }

    const newViews = currentViews + 1;

    // Format back
    let formattedViews: string;
    if (newViews >= 1000000) {
      formattedViews = (newViews / 1000000).toFixed(1) + "M";
    } else if (newViews >= 1000) {
      formattedViews = (newViews / 1000).toFixed(1) + "K";
    } else {
      formattedViews = String(newViews);
    }

    await supabase
      .from("dramas")
      .update({ views: formattedViews })
      .eq("id", dramaId);

    return NextResponse.json({ views: formattedViews });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
