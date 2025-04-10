import get from "lodash/get";
import set from "lodash/set";
import type { Field } from "payload";

const createField = <T extends Field>(options: T) => options;

export const createdByField = <T extends Omit<Field, "type">>(options: T) => ({
  ...createField({
    type: "relationship",
    name: "created_by",
    label: "Created By",
    relationTo: "users",
    hasMany: false,

    admin: {
      allowCreate: false,
      allowEdit: false,
      readOnly: true,
      description: "The user who created this document.",
    },

    hooks: {
      beforeChange: [
        async ({ req, path, data, field }) => {
          console.log(field.name, "beforeChange", data, path);
          const _path = path.join(".");

          if (get(data, _path, false)) {
            return;
          }
          const user = req.user;

          if (user) {
            set(req, _path, user.id);
          }
        },
      ],
      beforeDuplicate: [
        async ({ req, path }) => {
          const user = req.user;
          const _path = path.join(".");

          if (user) {
            set(req, _path, null);
          }
        },
      ],
    },
  }),
});
