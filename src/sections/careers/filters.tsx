import { getRolesAndLocations } from "@elvora/admin/server-actions/jobs";
import { responsive } from "@elvora/utils/breakpoints";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
//@ts-ignore
import bgPattern from "assets/get-in-touch/pattern.png";
import { CareersPageFiltersForm } from "./filters-form";

const CareersPageFilters = async () => {
  const [roles, locations] = await getRolesAndLocations();

  return (
    <Box sx={sx}>
      <Stack
        direction={{
          xs: "row",
        }}
      >
        <CareersPageFiltersForm roles={Object.keys(roles)} locations={Object.keys(locations)} />
      </Stack>
    </Box>
  );
};

const sx: SxProps = {
  "& .filters-form": {
    flex: 1,

    [responsive("up", "lg")]: {
      // marginTop: -5,
    },

    "& .MuiTextField-root fieldset": {
      boxShadow: 6,
    },

    background: `url(${bgPattern.src})`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right bottom",
  },

  [responsive("down", "sm")]: {
    "& .filters-form": {
      input: {
        fontSize: "1rem",
      },

      "& .MuiTextField-root fieldset": {
        boxShadow: 0,
      },
    },
  },

  [responsive("up", "md")]: {
    minWidth: 400,

    "& .filters-form": {
      paddingRight: 4,
      borderRight: "2px solid",
      borderColor: "white",
    },
  },

  [responsive("up", "lg")]: {
    minWidth: 450,
  },
};

export { CareersPageFilters };
