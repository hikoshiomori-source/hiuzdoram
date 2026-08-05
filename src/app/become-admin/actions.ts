"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAsAdmin(formData: FormData) {
  const code = formData.get("code");

  if (code === "NOCTURNE_ADMIN_2024") {
    // Await cookies() to resolve the Promise before calling .set()
    const cookieStore = await cookies();
    cookieStore.set("admin_token", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });
    return { success: true };
  }

  return { error: "Noto'g'ri kod!" };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  redirect("/");
}
