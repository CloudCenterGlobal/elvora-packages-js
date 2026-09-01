import { BlogsCollectionConfig } from "./Blogs";
import { JobsCollectionConfig } from "./Jobs";
import { MediaCollectionConfig } from "./Media";
import { PermissionsCollectionConfig } from "./Permissions";
import { ServicesCollectionConfig } from "./Services";
import { Users } from "./Users";

const collections = [
  Users,
  ...MediaCollectionConfig,
  ...BlogsCollectionConfig,
  ...JobsCollectionConfig,
  ...PermissionsCollectionConfig,
  ...ServicesCollectionConfig,
];

export * from "./Blogs";
export * from "./Jobs";
export * from "./Media";
export * from "./Users";

export * from "./Permissions";
export * from "./Services";

export { collections };
