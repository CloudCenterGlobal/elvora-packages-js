import configPromise from "@payload-config";
import { capitalCase } from "change-case";
import { getPayload as _getPayload, CollectionConfig, CollectionSlug, Payload } from "payload";

let _payload: Payload | null = null;

const getPayload = async () => {
  if (_payload) {
    return _payload;
  }

  _payload = await _getPayload({
    config: await configPromise,
  });

  return _payload;
};

const setPayload = (payload: Payload) => {
  _payload = payload;
};

const getCollectionLabel = (collection: CollectionSlug) => {
  const collectionConfig = _payload!.collections[collection] as unknown as CollectionConfig;

  if (!collectionConfig) {
    throw new Error(`Collection "${collection}" not found`);
  }

  let label = collectionConfig.labels?.singular || collectionConfig.labels?.plural;

  if (typeof label === "function" || !label) {
    return capitalCase(collection);
  }

  return label;
};

export { getCollectionLabel, getPayload, setPayload };
