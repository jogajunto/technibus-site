import { extractIdFromSpotifyUrl } from "@/utilities/extract-id-from-spotify-url";

export type SpotifyEmbedProps = {
  url: string;
  className?: string;
};

export function SpotifyEmbed({ url }: SpotifyEmbedProps) {
  const id = extractIdFromSpotifyUrl(url);

  return (
    <iframe
      data-testid="embed-iframe"
      className="rounded-xl"
      src={`https://open.spotify.com/embed/episode/${id}?utm_source=generator`}
      width="100%"
      height="152"
      frameBorder="0"
      allowFullScreen=""
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    ></iframe>
  );
}
