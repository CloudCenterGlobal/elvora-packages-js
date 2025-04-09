import { BlogsCollectionConfig } from "./Blogs";
import { JobsCollectionConfig } from "./Jobs";
import { MediaCollectionConfig } from "./Media";
import { Users } from "./Users";

const collections = [Users, ...MediaCollectionConfig, ...BlogsCollectionConfig, ...JobsCollectionConfig];

export * from "./Blogs";
export * from "./Jobs";
export * from "./Media";
export * from "./Users";

export { collections };
