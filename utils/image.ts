import type { StaticImageData } from "next/image";

/**
 *
 * @param image {StaticImageData} imported image
 * @param quality {number}  0 - 100
 * @returns
 */
export const getOptimizedImage = <T extends StaticImageData>(image: T, quality = 100) => {
  if (quality < 50 || quality > 100) {
    throw new Error("Quality must be between 50 and 100");
  }

  return `/_next/image?url=${encodeURIComponent(image.src)}&w=${1200}&q=${quality}` as const;
};
