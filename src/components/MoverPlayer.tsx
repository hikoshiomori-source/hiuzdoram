interface MoverPlayerProps {
  embedUrl: string;
  title?: string;
}

export default function MoverPlayer({ embedUrl, title }: MoverPlayerProps) {
  return (
    <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-2xl bg-surface-base ring-1 ring-border-glass">
      <iframe
        src={embedUrl}
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
        title="Video Player"
      />
    </div>
  );
}
