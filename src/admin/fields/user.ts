import type { Field, SingleRelationshipField } from "payload";

const createField = <T extends Field>(options: T) => options;

export const currentUserField = <
  TX extends Omit<T, keyof X> & X,
  T extends Omit<X, "type" | "relationTo" | "name"> & {
    name?: string;
  },
  X extends SingleRelationshipField = SingleRelationshipField & {
    type: "relationship";
    relationTo: "users";
    name: "createdBy" | "publishedBy";
  },
>(
  options: T | X | TX = {} as T | X | TX
) => ({
  ...createField({
    type: "relationship",
    relationTo: "users",
    // @ts-ignore
    hasMany: false,
    ...options,

    name: options.name || "createdBy",
    label: options.label || "Created By",
    admin: {
      allowCreate: false,
      allowEdit: false,
      description: "The user who created this document.",
      readOnly: true,
      ...(options.admin as Partial<SingleRelationshipField["admin"]>),
      disableBulkEdit: true,
    },

    hooks: {
      beforeChange: [
        async ({ req, value }) => {
          if (!value && req.user) {
            return req.user.id;
          }

          return value;
        },
      ],
      beforeDuplicate: [
        async () => {
          return null;
        },
      ],
      ...(options.hooks as Partial<SingleRelationshipField["hooks"]>),
    },
  }),
});
