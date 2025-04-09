export interface LexicalTextRoot {
  root: LexicalTextChild;
}

export interface LexicalTextChild {
  type: LexicalTypes;
  format: string | number;
  indent: number;
  version: number;
  children: LexicalTextChild[];
  direction: "ltr" | "rtl";
  textStyle: string;
  textFormat: number;
  text?: string;
  mode?: LexicaTextMode;
  tag?: React.ElementType;
}

export type LexicalTypes =
  | "text"
  | "list"
  | "listitem"
  | "quote"
  | "code"
  | "image"
  | "video"
  | "audio"
  | "linebreak"
  | "link"
  | "file"
  | "embed"
  | "divider"
  | "paragraph"
  | "heading";

export type LexicaTextMode = "normal" | "highlight" | "quote";
