import { capitalCase } from "change-case";
import { CollectionConfig, CollectionSlug, Payload, getPayload as _getPayload } from "payload";
//@ts-ignore
import configPromise from "@payload-config";

let _payload: Payload | null = null;

const getPayload = async () => {
  if (_payload) {
    return _payload;
  }

  // @ts-ignore
  _payload = await _getPayload({ config: configPromise });

  return _payload!;
};

const getCollectionLabel = (collection: CollectionSlug, payload?: Payload) => {
  if (payload && !_payload) {
    _payload = payload;
  } else if (!_payload) {
    getPayload();
  }

  const collectionConfig = (_payload || payload)!.collections[collection] as unknown as CollectionConfig;

  if (!collectionConfig) {
    throw new Error(`Collection "${collection}" not found`);
  }

  let label = collectionConfig.labels?.singular || collectionConfig.labels?.plural;

  if (typeof label === "function" || !label) {
    return capitalCase(collection);
  }

  return label;
};

export { getCollectionLabel, getPayload };
