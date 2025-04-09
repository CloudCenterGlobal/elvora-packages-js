import { headers as nextHeaders } from "next/headers";

import { LexicalTextRoot } from "@elvora/admin/types";
import { capitalCase } from "change-case";
import path from "path";

// remove /api/ and /file/
const REPLACE_REGEX = /\/api\/|\/file/g;

export const toMediaUrl = (file: string | null | undefined) => {
  if (!file) return null;

  return path.join("/media", file.replace(REPLACE_REGEX, ""));
};

export const getOriginAndreferer = async () => {
  const headers = await nextHeaders();

  return {
    host: headers.get("host")!,
    referer: headers.get("referer")!,
    origin: headers.get("origin")!,
    pathname: headers.get("pathname")!,
  };
};

export const getFormSubmissionValuesAsArray = <T extends object>(data: T, exclude?: Partial<Record<keyof T, boolean>>) => {
  return Object.entries(data).reduce(
    (acc, [key, value]) => {
      if (exclude && exclude[key as keyof T]) {
        return acc;
      }

      acc.push({ label: capitalCase(String(key)), value: value || "N/A" });

      return acc;
    },
    [] as { label: string; value: string }[]
  );
};

export const getSubstringFromLexicalRichText = <T extends LexicalTextRoot>(description: T, max = 300) => {
  let desc = "";

  for (let i = 0; i < description.root.children.length; i++) {
    const text = description.root.children[i];

    if (!text) {
      continue;
    }

    if (typeof text === "object" && text.type === "paragraph") {
      // @ts-ignore
      desc += text.children.map((a) => a.text).join(" ");
    }

    if (typeof text === "string") {
      desc += text;
    }

    if (desc.length > max) {
      desc = desc.substring(0, max);
      desc += "...";
      break;
    }
  }

  return desc;
};
