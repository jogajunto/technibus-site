import { Block } from "payload";

import { isYouTubeUrl } from "@/utilities/is-youtube-url";

export const YouTubeEmbedBlock: Block = {
  slug: "youtubeEmbed",
  fields: [
    {
      name: "url",
      type: "text",
      label: "URL",
      required: true,
      admin: {
        placeholder: "https://www.youtube.com/watch?v=example",
      },
      validate: (value: string | undefined | null) => {
        if (value && !isYouTubeUrl(value)) {
          return "O link informado não é um URL válido do YouTube. Verifique e tente novamente.";
        }
        return true;
      },
    },
    {
      name: "title",
      type: "text",
      label: "Title",
      admin: {
        placeholder: "Título do vídeo",
      },
      required: true,
    },
  ],
};
