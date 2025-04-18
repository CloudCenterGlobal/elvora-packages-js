import { Loader } from "@googlemaps/js-api-loader";
import { GOOGLE_MAPS_API_KEY } from "../constants/maps";

const loader = new Loader({
  apiKey: GOOGLE_MAPS_API_KEY,
  version: "weekly",
  region: "GB",
});

export { loader };
