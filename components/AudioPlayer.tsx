type AudioPlayerProps = {
  src: string;
  title?: string;
};

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  return (
    <figure className="not-prose my-6 rounded-xl border border-black/10 bg-black/[0.02] p-4 dark:border-white/10 dark:bg-white/[0.03]">
      {title && (
        <figcaption className="mb-2 text-sm font-medium text-black/70 dark:text-white/70">
          {title}
        </figcaption>
      )}
      <audio controls preload="none" className="w-full">
        <source src={src} />
        Your browser does not support the audio element.
      </audio>
    </figure>
  );
}
