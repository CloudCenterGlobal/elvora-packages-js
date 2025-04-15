import { createCollection, userHasPermission } from "@elvora/admin/collections/Permissions/helpers";
import { cacheUserPermissionsInRedis, getDefaultCollectionAccess } from "./Permissions/helpers";

export const Users = createCollection({
  slug: "users",
  auth: {
    depth: 0,
    // 15 mins
    tokenExpiration: 15 * 60,
  },
  admin: {
    useAsTitle: "name",
    group: "Users",
  },
  access: getDefaultCollectionAccess("users"),

  hooks: {
    afterLogin: [
      async ({ user, req }) => {
        await cacheUserPermissionsInRedis(user!, req.payload);
      },
    ],
    afterRefresh: [
      async ({ req }) => {
        await cacheUserPermissionsInRedis(req.user!, req.payload);
      },
    ],
  },
  fields: [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      required: true,
    },
    {
      name: "bio",
      label: "Bio",
      type: "text",
      required: false,
    },
    {
      name: "avatar",
      label: "Profile Image",
      type: "upload",
      relationTo: "profile-images",
      required: false,
      hasMany: false,
      displayPreview: true,
    },
    {
      saveToJWT: true,
      type: "select",
      name: "role",
      defaultValue: "user",
      label: "Role",
      options: ["super-admin", "user"],

      access: {
        create({ req }) {
          return req.user?.role === "super-admin" || userHasPermission(req, ["users.create"]);
        },
        update({ req }) {
          return req.user?.role === "super-admin" || userHasPermission(req, ["users.update"]);
        },
      },
    },
  ],
  custom: {
    depth: 1,
  },
});
