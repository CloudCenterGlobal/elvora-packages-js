type Join<T extends (string | number)[]> = T extends [infer F, ...infer R]
  ? F extends string | number
    ? R extends (string | number)[]
      ? `${F}/${Join<R>}`
      : never
    : never
  : "";
export const joinPaths = <T extends (string | number)[]>(...parts: T) => {
  return parts.join("/") as Join<T>;
};

type SiteUrlFallback = string | (() => string | Promise<string>);

/**
 * The public origin of the site, from `NEXT_PUBLIC_SITE_URL`. Use this for any link that leaves the app (emails),
 * since behind nginx the request's own origin is the local upstream (http://localhost:<port>). The fallback is only
 * for environments where the variable isn't set, such as local development.
 */
export const getSiteUrl = async (fallback?: SiteUrlFallback) => {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  const url = configured || (typeof fallback === "function" ? await fallback() : fallback);

  if (!url) {
    throw new Error("NEXT_PUBLIC_SITE_URL must be set to build links for emails.");
  }

  return url.replace(/\/+$/, "");
};
