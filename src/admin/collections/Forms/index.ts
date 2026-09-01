import Referrals from "./Referrals";
import ReferralDocuments from "./ReferralDocuments";

const FormsCollectionConfig = [Referrals, ReferralDocuments].map((collection) => {
  collection.admin = {
    ...collection.admin,
    group: "Forms",
  };
  return collection;
});

export * from "./constants";
export { FormsCollectionConfig, Referrals, ReferralDocuments };
