import Referrals from "./Referrals";
import ReferralDocuments from "./ReferralDocuments";
import Callbacks from "./Callbacks";
import HomeEnquiries from "./HomeEnquiries";

const FormsCollectionConfig = [Referrals, ReferralDocuments, Callbacks, HomeEnquiries].map((collection) => {
  collection.admin = {
    ...collection.admin,
    group: "Forms",
  };
  return collection;
});

export * from "./constants";
export { FormsCollectionConfig, Referrals, ReferralDocuments, Callbacks, HomeEnquiries };
