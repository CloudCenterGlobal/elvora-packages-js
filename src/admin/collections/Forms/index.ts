import Referrals from "./Referrals";
import ReferralDocuments from "./ReferralDocuments";
import Callbacks from "./Callbacks";
import PropertyPartners from "./PropertyPartners";

const FormsCollectionConfig = [Referrals, ReferralDocuments, Callbacks, PropertyPartners].map((collection) => {
  collection.admin = {
    ...collection.admin,
    group: "Forms",
  };
  return collection;
});

export * from "./constants";
export { FormsCollectionConfig, Referrals, ReferralDocuments, Callbacks, PropertyPartners };
