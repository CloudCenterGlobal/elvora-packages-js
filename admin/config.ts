// storage-adapter-import-placeholder
import { postgresAdapter } from "@payloadcms/db-postgres";
import {
  AlignFeature,
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  IndentFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  ParagraphFeature,
  UnorderedListFeature,
} from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { collections, Users } from "./collections";
import { createMailAdapter } from "./functions";
import { DbConfig, PayloadConfig } from "./types";

// Database

async function createPayloadConfig(options: PayloadConfig) {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);

  const config = buildConfig({
    admin: {
      user: Users.slug,
      importMap: {
        baseDir: path.resolve(dirname),
      },
      theme: "light",
      avatar: {
        Component: "components/payload/#PayloadAvatar",
      },
      components: {
        providers: ["components/payload/#PayloadProvider"],
      },
      livePreview: {
        url({ data, collectionConfig, req }) {
          return `${process.env.NODE_ENV === "development" ? "http" : "https"}://${req.host}/preview/${collectionConfig!.slug}/${data.id}`;
        },
        collections: ["job-forms"],
        breakpoints: [
          {
            label: "Mobile",
            height: 640,
            width: 375,
            name: "mobile",
          },
          {
            label: "Tablet",
            height: 1024,
            width: 768,
            name: "tablet",
          },
        ],
      },
    },
    email: createMailAdapter(options.email),
    collections: collections,
    editor: lexicalEditor({
      features({ rootFeatures }) {
        return [
          ...rootFeatures,
          BoldFeature(),
          FixedToolbarFeature(),
          LinkFeature(),
          AlignFeature(),
          ItalicFeature(),
          IndentFeature(),
          HeadingFeature({
            enabledHeadingSizes: ["h1", "h2", "h3", "h4", "h5", "h6"],
          }),
          ParagraphFeature(),
          UnorderedListFeature(),
        ];
      },
    }),
    secret: process.env.PAYLOAD_SECRET || "",
    typescript: {
      outputFile: path.resolve(dirname, "types/payload.ts"),
    },

    db: postgresAdapter({
      pool: {
        connectionString: getDBUrl(options.db) || "",
      },
      push: false,
    }),
    sharp,
    plugins: [],
  });

  return config;
}

const getDBUrl = (config: DbConfig) => {
  return `postgres://${config.user}:${encodeURIComponent(config.password!)}@${config.host || "localhost"}:${config.port || 5432}/${config.database}`;
};

export { createPayloadConfig, getDBUrl };
