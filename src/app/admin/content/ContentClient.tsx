"use client";

import { useState } from "react";
import { saveDramaAction, deleteDramaAction, getEpisodesAction } from "./actions";

interface EpisodeForm {
  number: string;
  title: string;
  moverUrl: string;
  duration: string;
}

const AVAILABLE_GENRES = [
  "Romance", "Action", "Fantasy", "Medical", "Thriller", 
  "Sci-Fi", "Historical", "Slice of Life", "Comedy", "Melodrama"
];

const DAYS_OF_WEEK = [
  "Dushanba", "Seshanba", "Chorshanba", "Payshanba", 
  "Juma", "Shanba", "Yakshanba"
];

export default function ContentClient({ initialDramas }: { initialDramas: any[] }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [editingDramaId, setEditingDramaId] = useState<string | null>(null);

  const [dramaTitle, setDramaTitle] = useState("");
  const [dramaGenres, setDramaGenres] = useState<string[]>([]);
  const [dramaCountry, setDramaCountry] = useState("South Korea");
  const [dramaSynopsis, setDramaSynopsis] = useState("");
  const [totalEpisodes, setTotalEpisodes] = useState("");
  const [dramaRating, setDramaRating] = useState("");
  
  const [posterUrl, setPosterUrl] = useState("");
  const [backdropUrl, setBackdropUrl] = useState("");
  const [releaseDays, setReleaseDays] = useState<string[]>([]);
  const [releaseTime, setReleaseTime] = useState("");

  const [episodes, setEpisodes] = useState<EpisodeForm[]>([
    { number: "1", title: "", moverUrl: "", duration: "" },
  ]);

  const resetForm = () => {
    setEditingDramaId(null);
    setDramaTitle("");
    setDramaGenres([]);
    setDramaCountry("South Korea");
    setDramaSynopsis("");
    setTotalEpisodes("");
    setDramaRating("");
    setPosterUrl("");
    setBackdropUrl("");
    setReleaseDays([]);
    setReleaseTime("");
    setEpisodes([{ number: "1", title: "", moverUrl: "", duration: "" }]);
    setShowAddForm(false);
  };

  const handleEdit = async (drama: any) => {
    // Populate form with drama data
    setEditingDramaId(drama.id);
    setDramaTitle(drama.title);
    setDramaCountry(drama.country || "South Korea");
    setDramaSynopsis(drama.synopsis || "");
    setTotalEpisodes(drama.total_episodes?.toString() || "");
    setDramaRating(drama.rating?.toString() || "");
    setPosterUrl(drama.poster_url || "");
    setBackdropUrl(drama.backdrop_url || "");
    
    // Parse arrays
    setDramaGenres(Array.isArray(drama.genres) ? drama.genres : (typeof drama.genres === 'string' ? drama.genres.replace(/^{|}$/g, '').split(',') : []));
    setReleaseDays(Array.isArray(drama.release_days) ? drama.release_days : (typeof drama.release_days === 'string' ? drama.release_days.replace(/^{|}$/g, '').split(',') : []));
    setReleaseTime(drama.release_time || "");

    setShowAddForm(true);
    
    // Fetch episodes for this drama
    const { episodes: dbEpisodes, error } = await getEpisodesAction(drama.id);
    if (dbEpisodes && dbEpisodes.length > 0) {
      setEpisodes(dbEpisodes.map((ep: any) => ({
        number: ep.episode_number.toString(),
        title: ep.title || "",
        moverUrl: ep.mover_embed_url || "",
        duration: ep.duration || ""
      })));
    } else {
      setEpisodes([{ number: "1", title: "", moverUrl: "", duration: "" }]);
    }
  };

  const handleDelete = async (dramaId: string, title: string) => {
    if (confirm(`Rostdan ham "${title}" doramasini o'chirmokchimisiz? Barcha qismlari ham qo'shib o'chiriladi!`)) {
      const res = await deleteDramaAction(dramaId);
      if (res.error) alert("Xatolik: " + res.error);
    }
  };

  const addEpisode = () => {
    setEpisodes([
      ...episodes,
      { number: String(episodes.length + 1), title: "", moverUrl: "", duration: "" },
    ]);
  };

  const updateEpisode = (index: number, field: keyof EpisodeForm, value: string) => {
    const updated = [...episodes];
    updated[index][field] = value;
    setEpisodes(updated);
  };

  const removeEpisode = (index: number) => {
    if (episodes.length > 1) {
      setEpisodes(episodes.filter((_, i) => i !== index));
    }
  };

  const toggleGenre = (genre: string) => {
    setDramaGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const toggleDay = (day: string) => {
    setReleaseDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dramaGenres.length === 0) {
      alert("Iltimos, kamida bitta janrni tanlang.");
      return;
    }
    
    setIsSaving(true);
    const data = {
      id: editingDramaId,
      title: dramaTitle,
      genres: dramaGenres,
      country: dramaCountry,
      synopsis: dramaSynopsis,
      totalEpisodes: totalEpisodes,
      rating: dramaRating,
      posterUrl,
      backdropUrl,
      releaseDays,
      releaseTime,
      episodes,
    };

    const result = await saveDramaAction(data);
    setIsSaving(false);

    if (result.error) {
      alert("Xatolik: " + result.error);
    } else {
      alert(`Dorama "${dramaTitle}" muvaffaqiyatli saqlandi!`);
      resetForm();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
            Kontent Boshqaruvi
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Doramalarni qo&apos;shing, tahrirlang va boshqaring
          </p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-primary to-primary-container text-on-primary hover:shadow-[0_0_20px_rgba(210,187,255,0.4)] transition-all hover:scale-[1.02]"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Yangi Dorama
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-primary/20 rounded-2xl p-4 md:p-6 animate-fade-in-up">
          <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">
              {editingDramaId ? "edit" : "add_circle"}
            </span>
            {editingDramaId ? "Doramani Tahrirlash" : "Yangi Dorama Qo'shish"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-1">
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Dorama nomi *</label>
              <input required value={dramaTitle} onChange={(e) => setDramaTitle(e.target.value)} className="bg-surface-base/50 text-on-surface text-sm rounded-xl py-3 px-4 outline-none border border-border-glass focus:border-primary transition-all placeholder:text-text-secondary/50" placeholder="Masalan: Alchemy of Souls" />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-1">
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Jami qismlar soni</label>
              <input type="number" value={totalEpisodes} onChange={(e) => setTotalEpisodes(e.target.value)} className="bg-surface-base/50 text-on-surface text-sm rounded-xl py-3 px-4 outline-none border border-border-glass focus:border-primary transition-all placeholder:text-text-secondary/50" placeholder="16" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Poster Rasmi (URL) *</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-text-secondary text-lg">image</span>
                <input required value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} className="w-full bg-surface-base/50 text-on-surface text-sm rounded-xl py-3 pl-10 pr-4 outline-none border border-border-glass focus:border-primary transition-all placeholder:text-text-secondary/50" placeholder="https://.../poster.jpg" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Fon Rasmi (URL)</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-text-secondary text-lg">wallpaper</span>
                <input value={backdropUrl} onChange={(e) => setBackdropUrl(e.target.value)} className="w-full bg-surface-base/50 text-on-surface text-sm rounded-xl py-3 pl-10 pr-4 outline-none border border-border-glass focus:border-primary transition-all placeholder:text-text-secondary/50" placeholder="https://.../backdrop.jpg" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Janrlar (Bir nechtasini tanlashingiz mumkin) *</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {AVAILABLE_GENRES.map((genre) => {
                  const isSelected = dramaGenres.includes(genre);
                  return (
                    <button key={genre} type="button" onClick={() => toggleGenre(genre)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${isSelected ? "bg-primary text-on-primary border-primary shadow-[0_0_10px_rgba(210,187,255,0.3)]" : "bg-surface-container-high text-on-surface-variant border-border-glass hover:border-primary/50"}`}>{genre}</button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Qismlar Chiqish Kunlari</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = releaseDays.includes(day);
                  return (
                    <button key={day} type="button" onClick={() => toggleDay(day)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${isSelected ? "bg-secondary text-on-secondary border-secondary shadow-[0_0_10px_rgba(204,194,220,0.3)]" : "bg-surface-container-high text-on-surface-variant border-border-glass hover:border-secondary/50"}`}>{day}</button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Qismlar Chiqish Vaqti</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-text-secondary text-lg">schedule</span>
                <input type="time" value={releaseTime} onChange={(e) => setReleaseTime(e.target.value)} className="w-full bg-surface-base/50 text-on-surface text-sm rounded-xl py-3 pl-10 pr-4 outline-none border border-border-glass focus:border-primary transition-all" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-1">
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Reyting</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-brand-rose text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <input type="number" step="0.1" max="10" min="0" value={dramaRating} onChange={(e) => setDramaRating(e.target.value)} className="w-full bg-surface-base/50 text-on-surface text-sm rounded-xl py-3 pl-10 pr-4 outline-none border border-border-glass focus:border-primary transition-all placeholder:text-text-secondary/50" placeholder="9.5" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Mamlakat</label>
              <select value={dramaCountry} onChange={(e) => setDramaCountry(e.target.value)} className="bg-surface-base/50 text-on-surface text-sm rounded-xl py-3 px-4 outline-none border border-border-glass focus:border-primary transition-all">
                <option value="South Korea">🇰🇷 Janubiy Koreya</option>
                <option value="Japan">🇯🇵 Yaponiya</option>
                <option value="China">🇨🇳 Xitoy</option>
                <option value="Thailand">🇹🇭 Tailand</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">Tavsif</label>
              <textarea value={dramaSynopsis} onChange={(e) => setDramaSynopsis(e.target.value)} className="bg-surface-base/50 text-on-surface text-sm rounded-xl py-3 px-4 outline-none border border-border-glass focus:border-primary transition-all placeholder:text-text-secondary/50 min-h-[80px] resize-none" placeholder="Dorama haqida qisqacha tavsif..." />
            </div>
          </div>

          {/* Episodes */}
          <div className="border-t border-border-glass pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-xl">playlist_play</span>
                Qismlar ({episodes.length})
              </h3>
              <button type="button" onClick={addEpisode} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-semibold hover:bg-primary/20 transition-colors">
                <span className="material-symbols-outlined text-base">add</span> Qism qo&apos;shish
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {episodes.map((ep, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 items-end p-3 bg-surface-container/30 rounded-xl border border-border-glass/50">
                  <div className="col-span-1 flex flex-col gap-1">
                    <label className="text-xs text-text-secondary font-medium">№</label>
                    <div className="w-8 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-sm font-bold text-on-surface">{ep.number}</div>
                  </div>
                  <div className="col-span-3 flex flex-col gap-1">
                    <label className="text-xs text-text-secondary font-medium">Qism nomi</label>
                    <input value={ep.title} onChange={(e) => updateEpisode(i, "title", e.target.value)} className="bg-surface-base/50 text-on-surface text-sm rounded-lg py-2.5 px-3 outline-none border border-border-glass focus:border-primary transition-all placeholder:text-text-secondary/50" placeholder="Qism nomi" />
                  </div>
                  <div className="col-span-5 flex flex-col gap-1">
                    <label className="text-xs text-primary font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">play_circle</span> Mover.uz Video Ssilkasi *
                    </label>
                    <input required value={ep.moverUrl} onChange={(e) => updateEpisode(i, "moverUrl", e.target.value)} className="bg-surface-base/50 text-on-surface text-sm rounded-lg py-2.5 px-3 outline-none border border-primary/30 focus:border-primary focus:shadow-[0_0_12px_rgba(210,187,255,0.15)] transition-all placeholder:text-text-secondary/50" placeholder="https://mover.uz/video/embed/xxxxxxxx" />
                  </div>
                  <div className="col-span-2 flex flex-col gap-1">
                    <label className="text-xs text-text-secondary font-medium">Davomiyligi</label>
                    <input value={ep.duration} onChange={(e) => updateEpisode(i, "duration", e.target.value)} className="bg-surface-base/50 text-on-surface text-sm rounded-lg py-2.5 px-3 outline-none border border-border-glass focus:border-primary transition-all placeholder:text-text-secondary/50" placeholder="55:00" />
                  </div>
                  <div className="col-span-1 flex justify-end">
                    <button type="button" onClick={() => removeEpisode(i)} className="w-10 h-10 rounded-lg flex items-center justify-center text-text-secondary hover:text-error hover:bg-error/10 transition-colors">
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 flex items-start gap-2 p-3 bg-primary/5 border border-primary/15 rounded-xl">
              <span className="material-symbols-outlined text-primary text-lg flex-shrink-0 mt-0.5">info</span>
              <div className="text-xs text-on-surface-variant">
                <strong className="text-primary">Mover.uz URL formati:</strong> Har bir qism uchun Mover.uz&apos;dan embed ssilkasini kiriting. Format: <code className="bg-surface-container-high px-1.5 py-0.5 rounded text-primary text-xs">https://mover.uz/video/embed/VIDEO_ID</code>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-border-glass">
            <button type="button" disabled={isSaving} onClick={resetForm} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all disabled:opacity-50">
              Bekor qilish
            </button>
            <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl text-sm font-semibold hover:shadow-[0_0_20px_rgba(210,187,255,0.4)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100">
              {isSaving ? (
                <><span className="material-symbols-outlined animate-spin text-lg">refresh</span> Saqlanmoqda...</>
              ) : (
                <><span className="material-symbols-outlined text-lg">save</span> {editingDramaId ? "O'zgarishlarni Saqlash" : "Saqlash"}</>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Existing Dramas Table */}
      <div className="bg-surface-container-lowest border border-border-glass rounded-2xl overflow-hidden">
        <div className="p-4 md:p-6 border-b border-border-glass">
          <h2 className="text-lg font-bold text-on-surface">Barcha Doramalar</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-glass">
                <th className="text-left text-xs text-text-secondary font-semibold uppercase tracking-wider px-6 py-3">Nomi</th>
                <th className="text-left text-xs text-text-secondary font-semibold uppercase tracking-wider px-6 py-3">Holati</th>
                <th className="text-left text-xs text-text-secondary font-semibold uppercase tracking-wider px-6 py-3">Qismlar</th>
                <th className="text-left text-xs text-text-secondary font-semibold uppercase tracking-wider px-6 py-3">Ko&apos;rishlar</th>
                <th className="text-left text-xs text-text-secondary font-semibold uppercase tracking-wider px-6 py-3">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {initialDramas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant text-sm">
                    Hali doramalar yo'q. Birinchi doramani qo'shing!
                  </td>
                </tr>
              ) : (
                initialDramas.map((drama) => (
                  <tr key={drama.id} className="border-b border-border-glass/50 hover:bg-surface-container-low transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-14 rounded overflow-hidden relative flex-shrink-0 bg-surface-container-high">
                          {drama.poster_url && (
                            <img src={drama.poster_url} alt={drama.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="text-sm font-semibold text-on-surface">{drama.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${drama.status === "Published" ? "bg-success/20 text-success" : "bg-surface-bright/30 text-text-secondary"}`}>
                        {drama.status === "Published" ? "Nashr qilingan" : "Qoralama"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{drama.total_episodes || "?"}</td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">{drama.views}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleEdit(drama)} className="p-2 rounded-lg text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-colors">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onClick={() => handleDelete(drama.id, drama.title)} className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
