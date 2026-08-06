import Link from "next/link";
import { adminStats, adminDramas } from "@/lib/data";

const statCards = [
  { label: "Jami Doramalar", value: adminStats.totalDramas, icon: "movie", color: "text-[#e11d48]", bg: "bg-[#e11d48]/10" },
  { label: "Jami Qismlar", value: adminStats.totalEpisodes, icon: "play_circle", color: "text-[#10b981]", bg: "bg-[#10b981]/10" },
  { label: "Foydalanuvchilar", value: adminStats.totalUsers, icon: "group", color: "text-[#3b82f6]", bg: "bg-[#3b82f6]/10" },
  { label: "Jami Ko'rishlar", value: adminStats.totalViews, icon: "visibility", color: "text-[#f59e0b]", bg: "bg-[#f59e0b]/10" },
  { label: "Faol Foydalanuvchilar", value: adminStats.activeUsers, icon: "person_check", color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10" },
  { label: "Bugun Yangi", value: adminStats.newUsersToday, icon: "person_add", color: "text-[#06b6d4]", bg: "bg-[#06b6d4]/10" },
];

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-8 max-w-[1400px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#18181b] p-8 rounded-xl border border-[#27272a] shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-[#a1a1aa] mt-2 text-sm">
            Tizimning umumiy holati va statistika
          </p>
        </div>
        <Link
          href="/admin/content"
          className="flex items-center gap-2 px-6 py-3 bg-[#e11d48] text-white rounded-lg font-semibold hover:bg-[#be123c] transition-colors shadow-md"
        >
          <span className="material-symbols-outlined text-xl">add</span>
          Yangi Dorama
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 hover:border-[#3f3f46] transition-colors"
          >
            <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center mb-4`}>
              <span className={`material-symbols-outlined text-2xl ${stat.color}`}>{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-white mb-1">
              {stat.value}
            </p>
            <p className="text-xs text-[#a1a1aa] uppercase tracking-wider font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Content */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-lg">
        <div className="flex items-center justify-between p-6 border-b border-[#27272a] bg-[#27272a]/20">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#a1a1aa]">history</span>
            So'nggi qo'shilganlar
          </h2>
          <Link href="/admin/content" className="text-sm font-medium text-[#e11d48] hover:text-[#be123c] transition-colors flex items-center gap-1">
            Barchasini ko'rish <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#27272a] bg-[#27272a]/10">
                <th className="text-left text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider px-6 py-4">Nomi</th>
                <th className="text-left text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider px-6 py-4">Holat</th>
                <th className="text-left text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider px-6 py-4">Qismlar</th>
                <th className="text-left text-xs font-semibold text-[#a1a1aa] uppercase tracking-wider px-6 py-4">Reyting</th>
              </tr>
            </thead>
            <tbody>
              {adminDramas.map((drama) => (
                <tr key={drama.id} className="border-b border-[#27272a] hover:bg-[#27272a]/30 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-white">{drama.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-md font-medium ${
                        drama.status === "Published"
                          ? "bg-[#10b981]/10 text-[#10b981]"
                          : drama.status === "Draft"
                          ? "bg-[#71717a]/10 text-[#a1a1aa]"
                          : "bg-[#e11d48]/10 text-[#e11d48]"
                      }`}
                    >
                      {drama.status === "Published" ? "Aktiv" : drama.status === "Draft" ? "Qoralama" : "Kutilmoqda"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[#e4e4e7]">{drama.episodes}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-[#e11d48] text-sm font-medium">
                      <span
                        className="material-symbols-outlined text-[16px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span>{drama.rating || "N/A"}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
