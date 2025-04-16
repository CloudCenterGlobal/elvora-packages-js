import fs from "fs";
import handlebars from "handlebars";
import path from "path";
import { fileURLToPath } from "url";

const HERE = path.resolve(fileURLToPath(import.meta.url));
const BASE_DIR = path.dirname(HERE);
__dirname = BASE_DIR;
const TEMPLATES_DIR = BASE_DIR;

const loadTemplate = (file: AvailableTemplates) => {
  if (!file.endsWith(".mjml")) {
    file = file + ".mjml";
  }

  const output = path.join(TEMPLATES_DIR, file.replace(".mjml", ".html"));

  try {
    return fs.readFileSync(output, "utf8");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return null;
  }
};

const loadAndCompileTemplate = <T extends AvailableTemplates>(path: T, params: Params[T]) => {
  const input = loadTemplate(path)!;
  const template = handlebars.compile(input)(params);

  return template;
};

const getAllMjmlFiles = (strip: boolean = false) => {
  const files = fs.readdirSync(__dirname);

  return files.reduce((acc, file) => {
    if (file.endsWith(".mjml")) {
      acc.push((strip ? file.replace(".mjml", "") : file) as AvailableTemplates);
    }
    return acc;
  }, [] as AvailableTemplates[]);
};

// types

type Params = {
  "forms-submission": {
    title: string;
    description: string;
    form: {
      items: {
        label: string;
        value: string;
      }[];
      referer: string;
    };
    banner?: {
      title: string;
      description?: string;
      image: string;
      link?: {
        text: string;
        url: string;
      };
    };
  };
  "forgot-password": {
    link: string;
    name: string;
    expiry: number;
  };
};

type AvailableTemplates = keyof Params;

export { getAllMjmlFiles, loadAndCompileTemplate };
