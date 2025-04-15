import { PermissionsGroup } from "./Groups";
import { GroupUsers } from "./GroupUsers";
import { Permissions } from "./Permissions";

export * from "./constants";

export * from "./Groups";
export * from "./GroupUsers";
export * from "./Permissions";

export const PermissionsCollectionConfig = [Permissions, PermissionsGroup, GroupUsers].map((collection) => ({
  ...collection,
  admin: {
    ...collection.admin,
    group: "Permissions",
  },
}));
