import type { CollectionConfig, Field } from "payload";

const NO_FIELD = "@elvora/admin/collections/Forms/EmptyField#EmptyField";

/**
 * Replaces a collection's edit-form body with one custom component that renders the whole
 * submission. The original fields stay in the schema and API; they are only taken off the page, without changing the schema.
 * Apply before `withReadStatus`, so its status field is added afterwards and stays editable.
 */
const withCustomPage = (collection: CollectionConfig, component: string): CollectionConfig => ({
  ...collection,
  fields: [
    {
      name: "submission_page",
      type: "ui",
      admin: { components: { Field: component } },
    },
    ...collection.fields.map(
      (field) =>
        ({
          ...field,
          admin: {
            ...("admin" in field ? field.admin : {}),
            components: { ...("admin" in field ? field.admin?.components : {}), Field: NO_FIELD },
          },
        }) as Field,
    ),
  ],
});

export { withCustomPage };
