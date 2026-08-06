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
    <main className="w-full min-h-screen flex items-center justify-center relative bg-[#09090b]">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('${IMAGES.heroBackdrop}')` }}
      />
      <div className="absolute inset-0 bg-[#09090b]/80 z-0 backdrop-blur-sm" />
      
      {/* Card */}
      <div className="relative z-10 w-[90%] max-w-[400px] bg-[#18181b] border border-[#27272a] rounded-2xl p-8 flex flex-col gap-6 shadow-2xl">
        <div className="flex flex-col items-center gap-2">
          <span className="material-symbols-outlined text-[#e11d48] text-5xl mb-2">admin_panel_settings</span>
          <h2 className="text-2xl font-bold text-white text-center">Admin Qabulxonasi</h2>
          <p className="text-sm text-[#a1a1aa] text-center">
            Tizimga kirish uchun login va parolingizni kiriting.
          </p>
        </div>

        {error && (
          <div className="w-full bg-[#e11d48]/10 border border-[#e11d48]/30 text-[#e11d48] text-sm font-medium p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">Login</label>
            <input
              name="username"
              className="w-full bg-[#09090b] text-white text-sm rounded-lg py-3 px-4 outline-none border border-[#27272a] focus:border-[#e11d48] transition-colors"
              placeholder="admin"
              type="text"
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider">Parol</label>
            <input
              name="password"
              className="w-full bg-[#09090b] text-white text-sm rounded-lg py-3 px-4 outline-none border border-[#27272a] focus:border-[#e11d48] transition-colors"
              placeholder="********"
              type="password"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#e11d48] hover:bg-[#be123c] text-white text-sm font-semibold py-3 mt-2 rounded-lg transition-colors shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                Tekshirilmoqda...
              </>
            ) : (
              "Tizimga Kirish"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}
