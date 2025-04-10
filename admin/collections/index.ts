import { BlogsCollectionConfig } from "./Blogs";
import { JobsCollectionConfig } from "./Jobs";
import { MediaCollectionConfig } from "./Media";
import { PermissionsCollectionConfig } from "./Permissions";
import { Users } from "./Users";

const collections = [Users, ...MediaCollectionConfig, ...BlogsCollectionConfig, ...JobsCollectionConfig, ...PermissionsCollectionConfig];

export * from "./Blogs";
export * from "./Jobs";
export * from "./Media";
export * from "./Users";

export * from "./Permissions";

export { collections };
