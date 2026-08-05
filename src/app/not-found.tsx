import Link from "next/link";

export default function NotFound() {
  return (
    <main className="w-full min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-error/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="text-center px-6 relative z-10">
        <h1 className="text-8xl md:text-9xl font-black text-primary/20 leading-none tracking-tighter">
          404
        </h1>
        <div className="mt-4 mb-2">
          <span
            className="material-symbols-outlined text-6xl text-primary/50"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            movie_off
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface mt-4">
          Sahifa topilmadi
        </h2>
        <p className="text-on-surface-variant mt-2 max-w-md mx-auto">
          Kechirasiz, siz qidirayotgan sahifa mavjud emas yoki ko&apos;chirilgan.
        </p>
        <div className="flex items-center justify-center gap-4 mt-8">
          <Link
            href="/"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary rounded-full text-sm font-semibold hover:shadow-[0_0_20px_rgba(210,187,255,0.4)] transition-all hover:scale-105"
          >
            <span className="material-symbols-outlined text-lg">home</span>
            Bosh sahifa
          </Link>
          <Link
            href="/browse"
            className="flex items-center gap-2 px-6 py-3 bg-surface-container-high text-on-surface rounded-full text-sm font-semibold hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-lg">movie</span>
            Doramalar
          </Link>
        </div>
      </div>
    </main>
  );
}
