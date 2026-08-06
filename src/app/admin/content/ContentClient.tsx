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
  "Romantika", "Jangari", "Fantastika", "Tibbiyot", "Triller", 
  "Ilmiy-fantastika", "Tarixiy", "Hayotiy", "Komediya", "Sirlar", "Melodrama"
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
    <div className="flex flex-col gap-6 max-w-[1400px] mx-auto text-white">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#18181b] p-6 md:p-8 rounded-xl border border-[#27272a] shadow-lg">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Content Manager
          </h1>
          <p className="text-[#e11d48] mt-2 text-sm uppercase tracking-widest font-semibold">
            Doramalarni qo'shish va tahrirlash
          </p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#e11d48] text-white rounded-lg font-bold uppercase tracking-wider hover:bg-[#be123c] transition-colors shadow-md group"
          >
            <span className="material-symbols-outlined text-xl group-hover:rotate-90 transition-transform duration-300">add</span>
            Yangi Dorama
          </button>
        )}
      </div>

      {/* Add / Edit Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 md:p-6 animate-in fade-in slide-in-from-bottom-4">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#e11d48]">
              {editingDramaId ? "edit" : "add_circle"}
            </span>
            {editingDramaId ? "Doramani Tahrirlash" : "Yangi Dorama Qo'shish"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-1">
              <label className="text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider">Dorama nomi *</label>
              <input required value={dramaTitle} onChange={(e) => setDramaTitle(e.target.value)} className="bg-[#09090b] text-white text-sm rounded-lg py-3 px-4 outline-none border border-[#27272a] focus:border-[#e11d48] transition-colors placeholder:text-[#52525b]" placeholder="Masalan: Alchemy of Souls" />
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-1">
              <label className="text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider">Jami qismlar soni</label>
              <input type="number" value={totalEpisodes} onChange={(e) => setTotalEpisodes(e.target.value)} className="bg-[#09090b] text-white text-sm rounded-lg py-3 px-4 outline-none border border-[#27272a] focus:border-[#e11d48] transition-colors placeholder:text-[#52525b]" placeholder="16" />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider">Poster Rasmi (URL) *</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#52525b] text-lg">image</span>
                <input required value={posterUrl} onChange={(e) => setPosterUrl(e.target.value)} className="w-full bg-[#09090b] text-white text-sm rounded-lg py-3 pl-10 pr-4 outline-none border border-[#27272a] focus:border-[#e11d48] transition-colors placeholder:text-[#52525b]" placeholder="https://.../poster.jpg" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider">Fon Rasmi (URL)</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#52525b] text-lg">wallpaper</span>
                <input value={backdropUrl} onChange={(e) => setBackdropUrl(e.target.value)} className="w-full bg-[#09090b] text-white text-sm rounded-lg py-3 pl-10 pr-4 outline-none border border-[#27272a] focus:border-[#e11d48] transition-colors placeholder:text-[#52525b]" placeholder="https://.../backdrop.jpg" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider">Janrlar (Bir nechtasini tanlashingiz mumkin) *</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {AVAILABLE_GENRES.map((genre) => {
                  const isSelected = dramaGenres.includes(genre);
                  return (
                    <button key={genre} type="button" onClick={() => toggleGenre(genre)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${isSelected ? "bg-[#e11d48] text-white border-[#e11d48]" : "bg-[#27272a] text-[#a1a1aa] border-[#3f3f46] hover:border-[#a1a1aa]"}`}>{genre}</button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider">Qismlar Chiqish Kunlari</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = releaseDays.includes(day);
                  return (
                    <button key={day} type="button" onClick={() => toggleDay(day)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${isSelected ? "bg-[#3b82f6] text-white border-[#3b82f6]" : "bg-[#27272a] text-[#a1a1aa] border-[#3f3f46] hover:border-[#a1a1aa]"}`}>{day}</button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider">Qismlar Chiqish Vaqti</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#52525b] text-lg">schedule</span>
                <input type="time" value={releaseTime} onChange={(e) => setReleaseTime(e.target.value)} className="w-full bg-[#09090b] text-white text-sm rounded-lg py-3 pl-10 pr-4 outline-none border border-[#27272a] focus:border-[#e11d48] transition-colors" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-1">
              <label className="text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider">Reyting</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#e11d48] text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                <input type="number" step="0.1" max="10" min="0" value={dramaRating} onChange={(e) => setDramaRating(e.target.value)} className="w-full bg-[#09090b] text-white text-sm rounded-lg py-3 pl-10 pr-4 outline-none border border-[#27272a] focus:border-[#e11d48] transition-colors placeholder:text-[#52525b]" placeholder="9.5" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider">Mamlakat</label>
              <select value={dramaCountry} onChange={(e) => setDramaCountry(e.target.value)} className="w-full bg-[#09090b] text-white text-sm rounded-lg py-3 px-4 outline-none border border-[#27272a] focus:border-[#e11d48] transition-colors">
                <option value="South Korea">🇰🇷 Janubiy Koreya</option>
                <option value="Japan">🇯🇵 Yaponiya</option>
                <option value="China">🇨🇳 Xitoy</option>
                <option value="Thailand">🇹🇭 Tailand</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider">Tavsif</label>
              <textarea value={dramaSynopsis} onChange={(e) => setDramaSynopsis(e.target.value)} className="bg-[#09090b] text-white text-sm rounded-lg py-3 px-4 outline-none border border-[#27272a] focus:border-[#e11d48] transition-colors placeholder:text-[#52525b] min-h-[100px] resize-none" placeholder="Dorama haqida qisqacha tavsif..." />
            </div>
          </div>

          {/* Episodes */}
          <div className="border-t border-[#27272a] pt-6 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-[#e11d48] text-xl">playlist_play</span>
                Qismlar ({episodes.length})
              </h3>
              <button type="button" onClick={addEpisode} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-[#27272a] text-white text-sm font-semibold hover:bg-[#3f3f46] transition-colors">
                <span className="material-symbols-outlined text-base">add</span> Qism qo'shish
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {episodes.map((ep, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end p-4 bg-[#27272a]/30 rounded-xl border border-[#27272a]">
                  <div className="md:col-span-1 flex flex-col gap-1">
                    <label className="text-xs text-[#a1a1aa] font-medium">№</label>
                    <div className="w-10 h-10 rounded-lg bg-[#3f3f46] flex items-center justify-center text-sm font-bold text-white">{ep.number}</div>
                  </div>
                  <div className="md:col-span-3 flex flex-col gap-1">
                    <label className="text-xs text-[#a1a1aa] font-medium">Qism nomi</label>
                    <input value={ep.title} onChange={(e) => updateEpisode(i, "title", e.target.value)} className="bg-[#09090b] text-white text-sm rounded-lg py-2.5 px-3 outline-none border border-[#3f3f46] focus:border-[#e11d48] transition-colors placeholder:text-[#52525b]" placeholder="Qism nomi" />
                  </div>
                  <div className="md:col-span-5 flex flex-col gap-1">
                    <label className="text-xs text-[#e11d48] font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">play_circle</span> Mover.uz Video Ssilkasi *
                    </label>
                    <input required value={ep.moverUrl} onChange={(e) => updateEpisode(i, "moverUrl", e.target.value)} className="bg-[#09090b] text-white text-sm rounded-lg py-2.5 px-3 outline-none border border-[#e11d48]/50 focus:border-[#e11d48] transition-colors placeholder:text-[#52525b]" placeholder="https://mover.uz/video/embed/xxxxxxxx" />
                  </div>
                  <div className="md:col-span-2 flex flex-col gap-1">
                    <label className="text-xs text-[#a1a1aa] font-medium">Davomiyligi</label>
                    <input value={ep.duration} onChange={(e) => updateEpisode(i, "duration", e.target.value)} className="bg-[#09090b] text-white text-sm rounded-lg py-2.5 px-3 outline-none border border-[#3f3f46] focus:border-[#e11d48] transition-colors placeholder:text-[#52525b]" placeholder="55:00" />
                  </div>
                  <div className="md:col-span-1 flex justify-end">
                    <button type="button" onClick={() => removeEpisode(i)} className="w-10 h-10 rounded-lg flex items-center justify-center text-[#a1a1aa] hover:text-white hover:bg-[#e11d48] transition-colors">
                      <span className="material-symbols-outlined text-xl">delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 flex items-start gap-2 p-4 bg-[#3b82f6]/10 border border-[#3b82f6]/30 rounded-xl">
              <span className="material-symbols-outlined text-[#3b82f6] text-lg flex-shrink-0 mt-0.5">info</span>
              <div className="text-sm text-[#a1a1aa]">
                <strong className="text-[#3b82f6]">Mover.uz URL formati:</strong> Har bir qism uchun Mover.uz&apos;dan embed ssilkasini kiriting. Format: <code className="bg-[#09090b] border border-[#27272a] px-2 py-0.5 rounded text-[#3b82f6] text-xs">https://mover.uz/video/embed/VIDEO_ID</code>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 mt-8 pt-6 border-t border-[#27272a]">
            <button type="button" disabled={isSaving} onClick={resetForm} className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-semibold text-[#a1a1aa] hover:text-white hover:bg-[#27272a] transition-colors disabled:opacity-50">
              Bekor qilish
            </button>
            <button type="submit" disabled={isSaving} className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-[#e11d48] text-white rounded-lg text-sm font-bold hover:bg-[#be123c] transition-colors disabled:opacity-50 shadow-lg">
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
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-lg">
        <div className="p-6 border-b border-[#27272a]">
          <h2 className="text-lg font-bold text-white">Barcha Doramalar</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#27272a] bg-[#27272a]/10">
                <th className="text-left text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider px-6 py-4">Nomi</th>
                <th className="text-left text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider px-6 py-4">Holati</th>
                <th className="text-left text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider px-6 py-4">Qismlar</th>
                <th className="text-left text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider px-6 py-4">Amallar</th>
              </tr>
            </thead>
            <tbody>
              {initialDramas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#a1a1aa] text-sm">
                    Hali doramalar yo'q. Birinchi doramani qo'shing!
                  </td>
                </tr>
              ) : (
                initialDramas.map((drama) => (
                  <tr key={drama.id} className="border-b border-[#27272a] hover:bg-[#27272a]/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-16 rounded-md overflow-hidden relative flex-shrink-0 bg-black border border-[#27272a]">
                          {drama.poster_url && (
                            <img src={drama.poster_url} alt={drama.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="text-sm font-semibold text-white">{drama.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${drama.status === "Published" ? "bg-[#10b981]/10 text-[#10b981]" : "bg-[#71717a]/10 text-[#a1a1aa]"}`}>
                        {drama.status === "Published" ? "Nashr qilingan" : "Qoralama"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#e4e4e7]">{drama.total_episodes || "?"}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEdit(drama)} className="p-2 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#27272a] transition-colors border border-transparent hover:border-[#3f3f46]">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onClick={() => handleDelete(drama.id, drama.title)} className="p-2 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#e11d48] transition-colors border border-transparent hover:border-[#e11d48]">
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
