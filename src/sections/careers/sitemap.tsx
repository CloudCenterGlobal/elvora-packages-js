import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [];
}

export const generateSitemaps = () => {
  return {
    "/sitemap.xml": sitemap(),
  };
};
