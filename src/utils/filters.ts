import type { Where } from "payload";

export const buildBlogsFilter = (filter: BlogsFilter) => {
  const operator = filter.operator || "or";
  const where: Where = {
    [operator]: [],
  };

  if (filter.content) {
    where[operator]!.push({
      "content.children.text": {
        like: filter.title,
      },
    });
  }

  if (filter.title) {
    where[operator]!.push({
      title: {
        like: filter.title,
      },
    });
  }

  if (filter.category) {
    where[operator]!.push({
      categories: {
        equals: filter.category,
      },
    });
  }

  return where;
};

declare global {
  type BlogsFilter = {
    content?: string;
    title?: string;
    category?: string | number;

    operator?: "and" | "or";
  };
}
