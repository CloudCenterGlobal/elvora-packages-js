import type { Payload } from "payload";
import payload from "payload";
import { getAllPermissions, PermissionConfig } from "./constants";

export const syncPermissions = async (payload: Payload) => {
  // Get permissions in parallel
  const [definedPermissions, dbPermissions] = await Promise.all([
    getAllPermissions(payload) as Record<string, PermissionConfig>,
    payload.find({
      collection: "permissions",
      depth: 0,
      limit: 0,
      pagination: false,
    }),
  ]);

  console.log(definedPermissions);

  // Create lookup maps
  const definedMap = new Map(Object.entries(definedPermissions));
  const dbMap = new Map(dbPermissions.docs.map((p) => [p.key, p]));

  // Prepare changes
  const changes = {
    create: [] as PermissionConfig[],
    update: [] as { id: string | number; data: Partial<PermissionConfig> }[],
    delete: [] as (string | number)[],
  };

  // Process defined permissions
  definedMap.forEach((def, key) => {
    const dbPermission = dbMap.get(key);

    if (!dbPermission) {
      // New permission to create
      changes.create.push(def);
    } else if (dbPermission.description !== def.description) {
      // Existing permission needs update
      changes.update.push({
        id: dbPermission.id,
        data: {
          description: def.description,
        },
      });
    }
  });

  // Find permissions to delete (exist in DB but not in definitions)
  dbMap.forEach((dbPermission) => {
    if (!definedMap.has(dbPermission.key)) {
      changes.delete.push(dbPermission.id);
    }
  });

  // Execute changes in transaction if needed
  if (changes.create.length > 0 || changes.update.length > 0 || changes.delete.length > 0) {
    const transactionID = await payload.db.beginTransaction();

    if (!transactionID) {
      throw new Error("Failed to start transaction");
    }

    try {
      // Create new permissions
      if (changes.create.length > 0) {
        for (const permission of changes.create) {
          await payload.create({
            collection: "permissions",
            data: permission as any,
            req: { transactionID },
          });
        }
      }

      // Update existing permissions
      for (const change of changes.update) {
        await payload.update({
          collection: "permissions",
          id: change.id,
          data: change.data,
          req: { transactionID },
        });
      }

      // Delete removed permissions
      if (changes.delete.length > 0) {
        await payload.delete({
          collection: "permissions",
          where: {
            id: {
              in: changes.delete,
            },
          },
          req: { transactionID },
        });
      }

      // Commit transaction
      await payload.db.commitTransaction(transactionID);
    } catch (error) {
      console.error("Error syncing permissions:", error);
      await payload.db.rollbackTransaction(transactionID);
      throw error;
    }
  }

  return {
    added: changes.create.length,
    updated: changes.update.length,
    removed: changes.delete.length,
    total: definedMap.size,
  };
};

const initPayload = async () => {
  const payloadConfig = await import("@payload-config");

  const p = await payload.init({ config: payloadConfig.default });

  await syncPermissions(p);
};

// initPayload();
