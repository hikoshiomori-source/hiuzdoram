export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      <div className="w-full aspect-[2/3] rounded-xl bg-surface-container skeleton-shimmer" />
      <div className="space-y-2">
        <div className="h-4 bg-surface-container-high rounded-md w-3/4 skeleton-shimmer" />
        <div className="h-3 bg-surface-container rounded-md w-1/2 skeleton-shimmer" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function PlayerSkeleton() {
  return (
    <div className="w-full bg-surface-base rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border border-border-glass animate-pulse">
      <div className="w-full aspect-video bg-surface-container skeleton-shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-surface-container-high rounded-md w-2/3 skeleton-shimmer" />
        <div className="h-4 bg-surface-container rounded-md w-1/3 skeleton-shimmer" />
      </div>
    </div>
  );
}

export function EpisodeListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="glass-panel overflow-hidden">
      <div className="p-4 bg-surface-container-low border-b border-border-glass">
        <div className="h-5 bg-surface-container-high rounded w-24 skeleton-shimmer" />
      </div>
      <div className="flex flex-col">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-border-glass/30 animate-pulse">
            <div className="w-24 h-16 rounded-md bg-surface-container skeleton-shimmer flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-surface-container-high rounded w-20 skeleton-shimmer" />
              <div className="h-3 bg-surface-container rounded w-32 skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] flex items-end pb-12 px-4 md:px-6 overflow-hidden animate-pulse">
      <div className="absolute inset-0 bg-surface-container skeleton-shimmer" />
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-4">
        <div className="flex gap-3">
          <div className="h-6 w-24 bg-surface-container-high rounded-full skeleton-shimmer" />
          <div className="h-6 w-20 bg-surface-container-high rounded-full skeleton-shimmer" />
        </div>
        <div className="h-12 bg-surface-container-high rounded-lg w-2/3 skeleton-shimmer" />
        <div className="h-5 bg-surface-container rounded-md w-1/3 skeleton-shimmer" />
        <div className="h-20 bg-surface-container rounded-xl w-1/2 skeleton-shimmer" />
        <div className="h-12 w-40 bg-surface-container-high rounded-full skeleton-shimmer mt-4" />
      </div>
    </section>
  );
}
