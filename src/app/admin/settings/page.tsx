export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight">
          Sozlamalar
        </h1>
        <p className="text-on-surface-variant text-sm mt-1">Sayt va tizim sozlamalari</p>
      </div>

      {/* General Settings */}
      <div className="bg-surface-container-lowest border border-border-glass rounded-2xl p-6">
        <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">tune</span>
          Umumiy Sozlamalar
        </h2>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
              Sayt nomi
            </label>
            <input
              className="bg-surface-base/50 text-on-surface text-sm rounded-xl py-3 px-4 outline-none border border-border-glass focus:border-primary transition-all max-w-md"
              defaultValue="HiUzDoram"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
              Sayt tavsifi
            </label>
            <textarea
              className="bg-surface-base/50 text-on-surface text-sm rounded-xl py-3 px-4 outline-none border border-border-glass focus:border-primary transition-all max-w-md min-h-[80px] resize-none"
              defaultValue="Premium Asian doramalar streaming platformasi"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider">
              Default Video Manba
            </label>
            <input
              className="bg-surface-base/50 text-on-surface text-sm rounded-xl py-3 px-4 outline-none border border-primary/30 focus:border-primary transition-all max-w-md"
              defaultValue="https://mover.uz/video/embed/"
              readOnly
            />
            <p className="text-xs text-text-secondary">
              Barcha videolar Mover.uz orqali embed qilinadi
            </p>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end">
        <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-xl text-sm font-semibold hover:shadow-[0_0_20px_rgba(210,187,255,0.4)] transition-all hover:scale-[1.02]">
          <span className="material-symbols-outlined text-lg">save</span>
          Saqlash
        </button>
      </div>
    </div>
  );
}
