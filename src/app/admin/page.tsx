import Link from "next/link";
import { adminStats, adminDramas } from "@/lib/data";

const statCards = [
  { label: "Jami Doramalar", value: adminStats.totalDramas, icon: "movie", color: "text-primary", bg: "bg-primary/10" },
  { label: "Jami Qismlar", value: adminStats.totalEpisodes, icon: "play_circle", color: "text-secondary", bg: "bg-secondary/10" },
  { label: "Foydalanuvchilar", value: adminStats.totalUsers, icon: "group", color: "text-tertiary", bg: "bg-tertiary/10" },
  { label: "Jami Ko'rishlar", value: adminStats.totalViews, icon: "visibility", color: "text-brand-rose", bg: "bg-brand-rose/10" },
  { label: "Faol Foydalanuvchilar", value: adminStats.activeUsers, icon: "person_check", color: "text-success", bg: "bg-success/10" },
  { label: "Bugun Yangi", value: adminStats.newUsersToday, icon: "person_add", color: "text-primary-fixed", bg: "bg-primary-fixed/10" },
];

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
            Dashboard
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">Umumiy ko&apos;rinish va statistika</p>
        </div>
        <Link
          href="/admin/content"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl text-sm font-semibold hover:shadow-[0_0_20px_rgba(210,187,255,0.4)] transition-all hover:scale-[1.02]"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Yangi Dorama
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface-container-lowest border border-border-glass rounded-2xl p-4 hover:border-primary/20 transition-all group"
          >
            <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
              <span className={`material-symbols-outlined text-xl ${stat.color}`}>{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-on-surface group-hover:text-primary transition-colors">
              {stat.value}
            </p>
            <p className="text-xs text-text-secondary mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Content */}
      <div className="bg-surface-container-lowest border border-border-glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border-glass">
          <h2 className="text-lg font-bold text-on-surface">So&apos;nggi Kontentlar</h2>
          <Link href="/admin/content" className="text-sm text-primary hover:text-primary-fixed font-semibold transition-colors">
            Hammasini ko&apos;rish →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-glass">
                <th className="text-left text-xs text-text-secondary font-semibold uppercase tracking-wider px-6 py-3">Nomi</th>
                <th className="text-left text-xs text-text-secondary font-semibold uppercase tracking-wider px-6 py-3">Holati</th>
                <th className="text-left text-xs text-text-secondary font-semibold uppercase tracking-wider px-6 py-3">Qismlar</th>

                <th className="text-left text-xs text-text-secondary font-semibold uppercase tracking-wider px-6 py-3">Reyting</th>
              </tr>
            </thead>
            <tbody>
              {adminDramas.map((drama) => (
                <tr key={drama.id} className="border-b border-border-glass/50 hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-on-surface">{drama.title}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        drama.status === "Published"
                          ? "bg-success/20 text-success"
                          : drama.status === "Draft"
                          ? "bg-surface-bright/30 text-text-secondary"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {drama.status === "Published" ? "Nashr qilingan" : drama.status === "Draft" ? "Qoralama" : "Rejalashtirilgan"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{drama.episodes}</td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-brand-rose">
                      <span
                        className="material-symbols-outlined text-base"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        star
                      </span>
                      <span className="text-sm font-medium">{drama.rating || "—"}</span>
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
