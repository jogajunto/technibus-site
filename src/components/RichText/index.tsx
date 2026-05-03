import { DefaultNodeTypes, SerializedBlockNode } from "@payloadcms/richtext-lexical";
import { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";
import { RichText as ConvertRichText, JSXConvertersFunction } from "@payloadcms/richtext-lexical/react";

import { SpotifyEmbed, SpotifyEmbedProps } from "@/components/SpotifyEmbed";
import { YouTubeEmbed, YouTubeEmbedProps } from "@/components/YoutubeEmbed";

type RichTextProps = {
  data: SerializedEditorState;
};

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<YouTubeEmbedProps> | SerializedBlockNode<SpotifyEmbedProps>;

export function RichText({ data }: RichTextProps) {
  const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => {
    // 1. CONVERSORES ROBUSTOS: Substituímos nativos que sabemos que quebram na migração do WP
    const migrationSafeConverters: any = {
      ...defaultConverters,
      list: ({ node, nodesToJSX }: any) => {
        const children = nodesToJSX({ nodes: node.children, parent: node });
        // Se a propriedade vier nula da migração, assumimos 'bullet' (ul) como padrão
        if (node?.listType === "number") {
          return (
            <ol className="mb-4 list-decimal space-y-2 pl-6" start={node?.start || 1}>
              {children}
            </ol>
          );
        }
        return <ul className="mb-4 list-disc space-y-2 pl-6">{children}</ul>;
      },
      listitem: ({ node, nodesToJSX }: any) => {
        const children = nodesToJSX({ nodes: node.children, parent: node });
        return <li value={node?.value}>{children}</li>;
      },
    };

    // 2. VALIDADOR GERAL: Previne que falhas de importação causem tela azul no React
    const safeConverters: any = {};
    for (const key in migrationSafeConverters) {
      const Converter = migrationSafeConverters[key];

      if (typeof Converter === "function") {
        safeConverters[key] = (props: any) => {
          const result = Converter(props);

          // O React aceita null, mas odeia undefined. Se a migração falhar, nós salvamos a tela.
          if (result === undefined) {
            console.warn(`⚠️ [Migração WP] Nó malformado ignorado para evitar crash: '${key}'`);

            // Em dev, mostra o que falhou. Em produção, você pode trocar isso por "return null;"
            return (
              <span className="mx-1 inline-block rounded border border-yellow-300 bg-yellow-100 px-2 py-0.5 align-middle text-[10px] font-bold tracking-wider text-yellow-800 uppercase">
                Ajustar Migração: {key}
              </span>
            );
          }
          return result;
        };
      } else {
        safeConverters[key] = Converter;
      }
    }

    // 3. Retornamos o objeto com nossos Blocos e Uploads normais
    return {
      ...safeConverters,
      blocks: {
        ...(safeConverters.blocks || {}),
        youtubeEmbed: ({ node }: any) => <YouTubeEmbed {...node.fields} />,
        spotifyEmbed: ({ node }: any) => <SpotifyEmbed {...node.fields} />,
      },
      upload: (props) => <UploadNode {...props} />,
      link: (props) => <LinkNode {...props} />,
      autolink: (props) => <LinkNode {...props} />,
    };
  };

  return <ConvertRichText converters={jsxConverters} data={data} />;
}

function UploadNode({ node }: any) {
  const { value, fields } = node;
  if (!value) return null;

  const { alt, caption, sizes } = value;
  const { imageSize, alignment } = fields || { imageSize: null, alignment: null };

  const width = (imageSize && sizes?.[imageSize]?.width) || value.width;
  const height = (imageSize && sizes?.[imageSize]?.height) || value.height;
  const url = (imageSize && sizes?.[imageSize]?.url) || value.url;

  return (
    <figure style={{ maxWidth: `${width}px` }} className={`${alignment === "right" ? "ml-auto" : alignment === "center" ? "mx-auto" : "mr-auto"}`}>
      <img src={url} alt={alt || ""} width={width} height={height} loading="lazy" />
      {caption && <figcaption className="text-secondary pt-2 text-right text-sm italic">{caption}</figcaption>}
    </figure>
  );
}

function LinkNode({ node, nodesToJSX }: any) {
  const children = nodesToJSX({ nodes: node.children, parent: node });
  const fields = node.fields;

  let href: string | undefined = fields.url;

  if (fields.linkType === "internal" && fields.doc?.value) {
    const docValue = fields.doc.value as any;

    if (typeof docValue.relPermalink === "string") {
      href = docValue.relPermalink;
    } else if (docValue.slug) {
      href = docValue.slug;
    }
  }

  if (!href) return <span>{children}</span>;

  return (
    <a href={href} target={fields.newTab ? "_blank" : undefined} rel={fields.newTab ? "noopener noreferrer" : undefined}>
      {children}
    </a>
  );
}
