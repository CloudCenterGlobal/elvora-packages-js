import { LexicalTextChild } from "@elvora/types";
import Circle from "@mui/icons-material/Circle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Typography, { TypographyProps } from "@mui/material/Typography";

const LexicalChildren: React.FC<LexicalChildrenProps> = ({ data }) => {
  if (data.type === "text") {
    return (
      <Typography component="span" lineHeight="inherit" color="inherit" {...getProps(data)}>
        {data.text}
      </Typography>
    );
  }

  if (data.type === "paragraph") {
    return (
      <Typography
        variant="body2"
        {...{
          ...getProps(data),
          component: "div",
        }}
      >
        {data.children.map((item, index) => {
          return <LexicalChildren data={item} key={index} isChild />;
        })}
      </Typography>
    );
  }

  if (data.type === "heading") {
    return (
      <Typography
        variant="h6"
        {...{
          ...getProps(data),
          component: "div",
        }}
      >
        {data.children.map((item, index) => {
          return <span key={index}>{item.text}</span>;
        })}
      </Typography>
    );
  }

  if (data.type === "linebreak") {
    return <br />;
  }

  if (data.type == "list") {
    return (
      <List disablePadding>
        {data.children.map((item, index) => {
          return <LexicalChildren data={item} key={index} isChild />;
        })}
      </List>
    );
  }

  if (data.type === "listitem") {
    return (
      <ListItem>
        <ListItemIcon
          sx={{
            minWidth: 20,
            alignSelf: "flex-start",
            marginTop: 0.8,
            "& .MuiSvgIcon-root": {
              fontSize: "0.6rem",
              color: "text.secondary",
            },
          }}
        >
          <Circle fontSize="small" />
        </ListItemIcon>
        {data.children.map((item, index) => {
          return <LexicalChildren data={item} key={index} isChild />;
        })}
      </ListItem>
    );
  }

  return data.type;
};

const getProps = (data: LexicalTextChild): Partial<TypographyProps> => {
  const isPrimary = data.textFormat === 1 || data.format === 1;
  const align = (typeof data.format === "string" ? data.format : "inherit") as TypographyProps["align"];

  const isHeading = data.type === "heading";

  const indent = (data.indent || 0) * 1.5;

  return {
    color: isHeading ? "text.primary" : "text.secondary",
    fontWeight: isPrimary ? 600 : isHeading ? 700 : 400,
    variant: isPrimary ? "subtitle2" : data.tag ? textVariants[data.tag as string] : "body2",
    component: data.tag || "span",
    gutterBottom: isHeading || data.type === "paragraph",
    ml: indent,
    align,
  };
};

export type LexicalChildrenProps = {
  data: LexicalTextChild;
  isChild?: boolean;
};

const textVariants: Record<string, TypographyProps["variant"]> = {
  h1: "h4",
  h2: "h5",
  h3: "h6",
  h4: "subtitle1",
  h5: "subtitle2",
  h6: "body1",
  p: "body2",
  span: "caption",
  div: "body2",
  li: "body2",
  ul: "body2",
  a: "body2",
};

export { LexicalChildren };
