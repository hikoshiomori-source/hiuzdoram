"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAsAdmin(formData: FormData) {
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();

  // O'zingiz xohlagan login/parol (yoki .env dan olasiz)
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "hiuzdoram2024";

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
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

  return { error: "Login yoki parol noto'g'ri!" };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  redirect("/");
}
