import { Block } from "payload";

import { isSpotifyUrl } from "@/utilities/is-spotify-url";

export const SpotifyEmbedBlock: Block = {
  slug: "spotifyEmbed",
  fields: [
    {
      name: "url",
      type: "text",
      label: "URL",
      required: true,
      admin: {
        placeholder: "https://open.spotify.com/episode/...",
        description: "Cole o link do episódio do Spotify que deseja incorporar.",
      },
      validate: (value: string | undefined | null) => {
        if (value && !isSpotifyUrl(value)) {
          return "O link informado não é um URL válido do Spotify. Verifique e tente novamente.";
        }
        return true;
      },
    },
  ],
};
