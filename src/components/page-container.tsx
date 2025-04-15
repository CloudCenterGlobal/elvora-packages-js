import { mergeSxProps } from "@elvora/utils/sx";
import Container, { ContainerProps, ContainerTypeMap } from "@mui/material/Container";
import { SxProps, Theme } from "@mui/material/styles";

const PageContainer = <RootComponent extends React.ElementType = ContainerTypeMap["defaultComponent"]>({
  children,
  ignoreNavHeight,
  transparent,
  ...props
}: PageContainerProps<RootComponent>) => {
  return (
    <Container
      maxWidth="xl"
      {...props}
      className={`page-container ${props.className || ""}`}
      sx={mergeSxProps(
        sx,
        props.sx,
        !ignoreNavHeight && {
          paddingTop: "var(--page-container-padding-top)",
        },
        {
          ...(transparent && {
            backgroundColor: "transparent",
          }),
        }
      )}
    >
      {children}
    </Container>
  );
};

export type PageContainerProps<RootComponent extends React.ElementType = ContainerTypeMap["defaultComponent"]> = ContainerProps<
  RootComponent,
  {
    ignoreNavHeight?: boolean;
    transparent?: boolean;
  }
> & {
  component?: RootComponent;
};

const sx: SxProps<Theme> = {
  // display: "flex",
  // direction: "column",
  backgroundColor: "background.paper",
  position: "relative",
};

export default PageContainer;
