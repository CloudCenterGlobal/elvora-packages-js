import MuiLink, { LinkProps } from "@mui/material/Link";
import { forwardRef } from "react";

// The `component` prop is intentionally left unset here: the app's theme
// supplies `MuiLink`'s `component` default (NextLinkOrAnchor), which picks
// next/link vs a plain anchor per-href. Setting it explicitly here would
// pass a function reference across the Server -> Client Component boundary
// wherever this renders inside a Server Component, which React rejects.
const NextLink = forwardRef<HTMLAnchorElement, NextLinkProps>(function NextLink(props, ref) {
  return (
    <MuiLink {...props} ref={ref}>
      {props.children}
    </MuiLink>
  );
});

export type NextLinkProps = LinkProps;

export { NextLink };
