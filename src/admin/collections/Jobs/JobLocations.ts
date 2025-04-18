import { createCollection } from "@elvora/admin/collections/Permissions/helpers";
import { capitalCase } from "change-case";
import type { CollectionConfig } from "payload";

const JobLocations: CollectionConfig = createCollection({
  slug: "job-locations",
  admin: {
    useAsTitle: "location",
  },
  fields: [
    {
      name: "location",
      label: "Location",
      type: "text",
      required: true,
      unique: true,
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            if (data?.location) {
              data.location = capitalCase(data.location);
            }
          },
        ],
      },
    },
  ],
});

export default JobLocations;
