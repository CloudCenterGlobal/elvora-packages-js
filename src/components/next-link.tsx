import MuiLink, { LinkProps } from "@mui/material/Link";
import Link from "next/link";
import { forwardRef } from "react";

const NextLink = forwardRef<HTMLAnchorElement, NextLinkProps>(function NextLink(props, ref) {
  return (
    <MuiLink {...props} component={Link} ref={ref}>
      {props.children}
    </MuiLink>
  );
});

export type NextLinkProps = LinkProps<typeof Link>;

export { NextLink };
