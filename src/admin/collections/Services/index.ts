import Services from "./Services";

const ServicesCollectionConfig = [Services].map((a) => ({
  ...a,
  admin: {
    ...(a as any).admin,
    group: "Services",
  },
}));

export { Services, ServicesCollectionConfig };
