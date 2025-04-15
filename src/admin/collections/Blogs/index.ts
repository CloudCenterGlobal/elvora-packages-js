import BlogCategories from "./BlogCategories";
import BlogImages from "./BlogImages";
import Blogs from "./Blogs";
import BlogTags from "./BlogTags";

const BlogsCollectionConfig = [Blogs, BlogCategories, BlogImages, BlogTags].map((a) => ({
  ...a,
  admin: {
    ...(a as any).admin,
    group: "Blog",
  },
}));

export { BlogCategories, BlogImages, Blogs, BlogsCollectionConfig, BlogTags };
