import { Permission, PermissionsGroup } from "@elvora/types";
import { redisClient } from "@elvora/utils/redis";
import type {
  CollectionConfig,
  CollectionSlug,
  Payload,
  PayloadRequest,
  TypedUser,
} from "payload";
import {
  AllPermissionKeys,
  collectionPermissions,
  getAllPermissions,
  PermissionConfig,
  PermissionObjectKey,
} from "./constants";

const syncPermissions = async (payload: Payload) => {
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
  if (
    changes.create.length > 0 ||
    changes.update.length > 0 ||
    changes.delete.length > 0
  ) {
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

const getUserPermissionsFromDb = async (
  user: TypedUser,
  payload: Payload
): Promise<Record<AllPermissionKeys, boolean>> => {
  if (!user?.id) {
    return {} as any;
  }

  const groups = await payload.find({
    collection: "permission-group-users",
    where: {
      user: {
        equals: user.id,
      },
    },
    depth: 2,
  });

  const permissions = groups.docs.reduce(
    (acc, group) => {
      const permissionGroup = group.group as PermissionsGroup;
      permissionGroup.permissions.forEach((permission) => {
        acc[(permission as Permission).key as PermissionObjectKey] = true;
      });
      return acc;
    },
    {} as Record<AllPermissionKeys, boolean>
  );

  return permissions;
};

const cacheUserPermissionsInRedis = async (
  user: TypedUser,
  payload: Payload
) => {
  const permissions = await getUserPermissionsFromDb(user, payload);

  if (!permissions || Object.keys(permissions).length === 0) {
    return;
  }
};

const getUserPermissions = async (
  user: TypedUser,
  payload: Payload
): Promise<Record<AllPermissionKeys, boolean>> => {
  // Check if permissions are cached in Redis
  if (!user?.id) {
    return {} as any;
  }

  if (redisClient.isOpen === false) {
    // Connect to Redis if not already connected
    try {
      await redisClient.connect();
    } catch (error) {
      console.error("Error connecting to Redis:", error);
      return {} as any;
    }
  }

  const cachedPermissions = await redisClient.get(
    `user-permissions:${user.id}`
  );

  if (cachedPermissions) {
    const parsed = JSON.parse(cachedPermissions);
    if (Object.keys(parsed ?? {}).length > 0) {
      return parsed as Record<AllPermissionKeys, boolean>;
    }
  }
  return getUserPermissionsFromDb(user, payload);
};

const userHasPermission = async (
  { user, payload }: { user: TypedUser; payload: Payload } | PayloadRequest,
  permissions: AllPermissionKeys[],

  _or?: boolean
) => {
  if (user?.role === "super-admin") {
    return true;
  }

  const userPermissions = await getUserPermissions(user!, payload);
  if (!userPermissions) {
    return false;
  }
  return permissions?.[_or ? "some" : "every"](
    (permission) => userPermissions[permission]
  );
};

const getDefaultCollectionAccess = (
  collectionName: CollectionSlug,
  defaults?: Access
) => {
  return collectionPermissions.reduce(
    (prev, name) => {
      if (prev[name as keyof Access] !== undefined) {
        return prev;
      }

      prev[name as keyof Access] = ({ req }) => {
        return userHasPermission(req, [`${collectionName}.${name}`]);
      };

      return prev;
    },
    {
      ...defaults,
    } as Access
  );
};

type Access = NonNullable<CollectionConfig["access"]>;

const createCollection = <T extends CollectionConfig>(collection: T) => {
  return {
    ...collection,
    access: {
      ...getDefaultCollectionAccess(
        collection.slug as CollectionSlug,
        collection.access
      ),
    },
  };
};

export {
  cacheUserPermissionsInRedis,
  createCollection,
  getDefaultCollectionAccess,
  getUserPermissionsFromDb,
  syncPermissions,
  userHasPermission,
};
