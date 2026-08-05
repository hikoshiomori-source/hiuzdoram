"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { IMAGES } from "@/lib/data";
import { loginAsAdmin } from "./actions";

export default function BecomeAdminPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setIsLoading(true);

    try {
      const result = await loginAsAdmin(formData);
      
      if (result?.error) {
        setError(result.error);
      } else {
        alert("Tabriklaymiz, siz Admin bo'ldingiz!");
        router.push("/admin");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Xatolik yuz berdi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full min-h-screen flex items-center justify-center relative bg-background">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url('${IMAGES.heroBackdrop}')` }}
      />
      <div className="absolute inset-0 bg-background/60 z-0 backdrop-blur-sm" />
      
      {/* Card */}
      <div className="relative z-10 w-[90%] max-w-[400px] bg-surface-glass backdrop-blur-2xl border border-border-glass rounded-3xl p-8 flex flex-col gap-6 shadow-[0_25px_50px_-12px_rgba(12,19,36,0.8)]">
        <div className="flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-primary text-4xl mb-2 drop-shadow-[0_0_15px_rgba(210,187,255,0.5)]">admin_panel_settings</span>
          <h2 className="text-2xl font-bold text-on-surface text-center">Admin Qabulxonasi</h2>
          <p className="text-sm text-on-surface-variant text-center">
            Admin bo'lish uchun maxfiy kodni kiriting.
          </p>
        </div>

        {error && (
          <div className="w-full bg-error/20 border border-error/50 text-error text-sm font-medium p-3 rounded-xl">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="flex flex-col gap-4">
          <input
            name="code"
            className="w-full bg-surface-base/50 text-on-surface text-sm rounded-xl py-3 px-4 outline-none border border-border-glass focus:border-primary focus:bg-surface-base focus:shadow-[0_0_12px_rgba(210,187,255,0.2)]"
            placeholder="Maxfiy kod..."
            type="password"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-container text-on-primary text-sm font-semibold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(210,187,255,0.2)] hover:shadow-[0_0_25px_rgba(210,187,255,0.4)] disabled:opacity-50"
          >
            {isLoading ? "Tekshirilmoqda..." : "Tasdiqlash"}
          </button>
        </form>
      </div>
    </main>
  );
}
