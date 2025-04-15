import { getCollectionLabel } from "@elvora/utils/payload";
import { capitalCase } from "change-case";
import type { Collection, CollectionPermission, CollectionSlug, Payload } from "payload";

const createPermissionObject = <T extends PermissionObjectKey>(opts: PermissionConfig<T>, payload: Payload) => {
  const permission = {
    [opts.key]: formatDefaultDescription(
      {
        ...opts,
        label: capitalCase(opts.label),
        description: opts.description,
      },
      payload
    ),
  } as const;

  return permission as Record<T, (typeof permission)[T]>;
};

export const customPermissions = {};

const excludedCollections: { [key in CollectionSlug]?: true } = {
  "payload-migrations": true,
  "payload-locked-documents": true,
  "payload-preferences": true,
} as const;

export const getAllCollectionPermissions = (payload: Payload) => {
  const collections = Object.entries(payload.collections) as unknown as [CollectionSlug, Collection][];

  const output = collections.reduce(
    (acc, [slug, collection]) => {
      if (excludedCollections[slug]) {
        return acc;
      }

      const permissions = collectionPermissions.reduce(
        (acc, permission) => {
          if (permission === "readVersions" && !collection.config?.versions) {
            return acc;
          }

          const permissionKey = `${slug}.${permission}` as PermissionObjectKey;

          return {
            ...acc,
            ...createPermissionObject(
              {
                key: permissionKey,
                label: permission,
                collection: slug,
              },
              payload
            ),
          };
        },
        {} as Record<PermissionObjectKey, PermissionConfig<PermissionObjectKey>>
      );

      return {
        ...acc,
        ...permissions,
      };
    },
    {} as Record<PermissionObjectKey, PermissionConfig<PermissionObjectKey>>
  );

  return output;
};

export const getAllPermissions = (payload: Payload) => {
  return {
    ...getAllCollectionPermissions(payload),
    ...customPermissions,
  };
};

const formatDefaultDescription = <Permission extends PermissionConfig<T>, T extends PermissionObjectKey>(t: Permission, payload: Payload) => {
  if (!t.description) {
    const label = getCollectionLabel(t.collection, payload);

    switch (t.key.split(".")[1]) {
      case "create":
        t.description = `Create ${label}`;
        break;
      case "read":
        t.description = `Read ${label}`;
        break;
      case "update":
        t.description = `Update ${label}`;
        break;
      case "delete":
        t.description = `Delete ${label}`;
        break;
      case "readVersions":
        t.description = `Read versions of ${label}`;
        break;
      default:
        break;
    }
  }

  return t;
};

export const collectionPermissions: (keyof CollectionPermission)[] = ["create", "read", "update", "delete", "readVersions"];

// types

export type PermissionObjectKey = `${CollectionSlug}.${keyof CollectionPermission}`;
export type PermissionConfig<T extends PermissionObjectKey = PermissionObjectKey> = {
  key: T;
  label: string;
  description?: string;
  collection: CollectionSlug;
};

export type AllPermissions = Record<PermissionObjectKey, CollectionPermission> & CustomPermissionsObject;
type CustomPermissionsObject = typeof customPermissions;
