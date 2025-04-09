import { alpha, Theme } from "@mui/material/styles";

// ----------------------------------------------------------------------

function getDirection(value = "bottom") {
  return {
    top: "to top",
    right: "to right",
    bottom: "to bottom",
    left: "to left",
  }[value];
}

// ----------------------------------------------------------------------

export default function cssStyles(theme?: Theme) {
  return {
    bgBlur: (props?: { color?: string; blur?: number; opacity?: number; filters?: string }) => {
      const color = props?.color || theme?.palette.background.default;

      const blur = props?.blur || 6;
      const opacity = props?.opacity || 0.8;
      const filters = props?.filters || "";

      return {
        backdropFilter: `blur(${blur}px) ${`${filters}`}`, // Fix on Mobile
        WebkitBackdropFilter: `blur(${blur}px) ${`${filters}`}`, // Fix on Mobile
        ...(color && { backgroundColor: alpha(color, opacity) }),
      };
    },
    bgGradient: (props?: { direction?: "top" | "right" | "bottom" | "left"; startColor?: string; endColor?: string }) => {
      const direction = getDirection(props?.direction);
      const startColor = props?.startColor || `${alpha("#000000", 0)} 0%`;
      const endColor = props?.endColor || "#000000 75%";

      return {
        background: `linear-gradient(${direction}, ${startColor}, ${endColor});`,
      };
    },
    bgImage: (props?: { url?: string; direction?: "top" | "right" | "bottom" | "left"; startColor?: string; endColor?: string }) => {
      const url = props?.url || "https://minimal-assets-api.vercel.app/assets/images/bg_gradient.jpg";
      const direction = getDirection(props?.direction);
      const startColor = props?.startColor || alpha(theme?.palette.grey[900] || "#000000", 0.88);
      const endColor = props?.endColor || alpha(theme?.palette.grey[900] || "#000000", 0.88);

      return {
        background: `linear-gradient(${direction}, ${startColor}, ${endColor}), url(${url})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
      };
    },
  };
}
