import { SpotifyEmbedBlock } from "@/blocks/SpotifyEmbed";
import { YouTubeEmbedBlock } from "@/blocks/YoutubeEmbed";
import {
  BlockquoteFeature,
  BlocksFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  LinkFields,
  OrderedListFeature,
  ParagraphFeature,
  UnderlineFeature,
  UnorderedListFeature,
  UploadFeature,
} from "@payloadcms/richtext-lexical";
import { RichTextAdapterProvider, TextFieldSingleValidation } from "payload";

const editor: RichTextAdapterProvider<any, any, any> = lexicalEditor({
  features: () => [
    UploadFeature({
      collections: {
        media: {
          fields: [
            {
              name: "imageSize",
              type: "select",
              label: "Tamanho da imagem",
              defaultValue: "original",
              options: [
                { label: "Original", value: "original" },
                { label: "Miniatura (300px)", value: "thumbnail" },
                { label: "Médio (768px)", value: "medium" },
                { label: "Grande (1024px)", value: "large" },
                { label: "Extra grande (1536px)", value: "xlarge" },
              ],
              admin: {
                description: "Alguns tamanhos podem não existir para imagens pequenas. O sistema validará ao salvar.",
              },
            },
            {
              name: "alignment",
              type: "radio",
              label: "Alinhamento da imagem",
              options: [
                {
                  label: "Esquerda",
                  value: "left",
                },
                {
                  label: "Centro",
                  value: "center",
                },
                {
                  label: "Direita",
                  value: "right",
                },
              ],
              defaultValue: "left",
              admin: {
                layout: "horizontal",
              },
            },
          ],
        },
      },
    }),
    FixedToolbarFeature(),
    ParagraphFeature(),
    UnderlineFeature(),
    BoldFeature(),
    ItalicFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
    BlockquoteFeature(),
    HeadingFeature({ enabledHeadingSizes: ["h2", "h3", "h4", "h5", "h6"] }),
    LinkFeature({
      enabledCollections: ["posts"],
      fields: ({ defaultFields }) => {
        const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
          if ("name" in field && field.name === "url") return false;
          return true;
        });

        return [
          ...defaultFieldsWithoutUrl,
          {
            name: "url",
            type: "text",
            admin: {
              condition: (_data, siblingData) => siblingData?.linkType !== "internal",
            },
            label: ({ t }) => t("fields:enterURL"),
            required: true,
            validate: ((value, options) => {
              if ((options?.siblingData as LinkFields)?.linkType === "internal") {
                return true;
              }
              return value ? true : "URL is required";
            }) as TextFieldSingleValidation,
          },
        ];
      },
    }),
    BlocksFeature({
      blocks: [YouTubeEmbedBlock, SpotifyEmbedBlock],
    }),
  ],
});

export default editor;
