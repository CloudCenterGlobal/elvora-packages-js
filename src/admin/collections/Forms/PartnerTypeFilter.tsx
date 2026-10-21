"use client";

import { Button } from "@payloadcms/ui";
import { usePathname, useSearchParams } from "next/navigation";
import { PARTNER_TYPE_OPTIONS } from "./constants";

const PARAM = "where[partner_type][equals]";

export const PartnerTypeFilter = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get(PARAM);

  const hrefFor = (value?: string) => {
    const params = new URLSearchParams(searchParams);
    params.delete("page");
    if (value) params.set(PARAM, value);
    else params.delete(PARAM);
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  };

  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
      {[{ label: "All", value: undefined }, ...PARTNER_TYPE_OPTIONS].map((option) => (
        <Button
          key={option.label}
          el="link"
          to={hrefFor(option.value)}
          size="small"
          buttonStyle={(active ?? undefined) === option.value ? "primary" : "secondary"}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};
