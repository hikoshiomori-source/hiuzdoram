"use client";

import { useEffect } from "react";

export default function ViewTracker({ dramaId }: { dramaId: string }) {
  useEffect(() => {
    const key = `viewed_${dramaId}`;
    if (typeof window !== "undefined" && !sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, "1");
      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dramaId }),
      }).catch(() => {});
    }
  }, [dramaId]);

  return null;
}
