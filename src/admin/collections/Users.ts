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
    read: () => {
      return true;
    },
    update: ({ req, data }) => {
      return (!!data && data.id === req.user?.id) || userHasPermission(req, ["users.update"]);
    },
    unlock({ req }) {
      return userHasPermission(req, ["users.update"]);
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
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      unique: true,
      admin: {
        description: "This is the email used to login",
      },
      access: {
        update({ req, data }) {
          return userHasPermission(req, ["users.update"]);
        },
      },
    },
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
      access: {
        update({ req, data }) {
          return data?.id === req.user?.id || userHasPermission(req, ["users.update"]);
        },
      },
    },
    {
      name: "avatar",
      label: "Profile Image",
      type: "upload",
      relationTo: "profile-images",
      required: false,
      hasMany: false,
      displayPreview: true,
      admin: {
        description: "Image will be resized to 200x200",
      },
      access: {
        read() {
          return true;
        },
        update({ req, data }) {
          return data?.id === req.user?.id || userHasPermission(req, ["users.update"]);
        },
      },
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
          return userHasPermission(req, ["users.create"]);
        },
        update({ req }) {
          return userHasPermission(req, ["users.update"]);
        },
      },
    },
  ],
  custom: {
    depth: 1,
  },
});
