import { createCollection, userHasPermission } from "@elvora/admin/collections/Permissions/helpers";
import { loadAndCompileTemplate } from "@elvora/mjml/helpers";
import { cacheUserPermissionsInRedis } from "./Permissions/helpers";

export const Users = createCollection({
  slug: "users",
  auth: {
    depth: 0,
    // 15 mins
    tokenExpiration: 15 * 60,
    forgotPassword: {
      generateEmailHTML(req) {
        const url = new URL(req?.req?.referrer!);
        // admin/reset/a82e7f28d0711f5bab7cd90f8d2a2dd4761b14d7
        const link = `${url.origin}/admin/reset/${req?.token!}`;

        return loadAndCompileTemplate("forgot-password", {
          link,
          name: req?.user?.name || " there",
          expiry: 15,
        });
      },
    },
  },
  admin: {
    useAsTitle: "name",
    group: "Users",
  },
  access: {
    read: ({ req }) => {
      return true;
    },
  },

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
