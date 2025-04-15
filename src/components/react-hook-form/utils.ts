import cssStyles from "@elvora/utils/cssStyles";
import { Options } from "./types";

const getOption = (option: Options[number]) => {
  return {
    label: typeof option === "object" ? option.label : option,
    value: typeof option === "object" ? option.value : option,
  };
};

const alternative_sx: SxProps = {
  "&:not(.defaultLabelStyle)": {
    "& .MuiFormLabel-root": {
      marginBottom: 0.5,
    },
  },

  "&.alternative": {
    "& .MuiFormLabel-root[data-shrink='false']:not(.Mui-error)": {
      opacity: 0.5,
    },

    "& .MuiOutlinedInput-root": {
      borderRadius: 1.25,
      ...cssStyles().bgBlur({
        color: "#ffffff",
        opacity: 0.5,
      }),
      "& .MuiOutlinedInput-notchedOutline": {
        borderWidth: 2,
        borderRadius: 1.25,

        "&, &:hover": {
          borderColor: "common.white",
        },
      },

      "&.Mui-focused": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "secondary.light",
        },
      },
    },
  },
};

export { alternative_sx, getOption };
