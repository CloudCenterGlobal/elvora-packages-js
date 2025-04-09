import configPromise from "@payload-config";
import { getPayload as _getPayload } from "payload";

const getPayload = async () => {
  const payload = await _getPayload({
    config: await configPromise,
  });

  return payload;
};

export { getPayload };
