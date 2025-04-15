type BreakpointDirection = "down" | "up" | "between";

const breakpoints = {
  values: {
    xs: 0,
    sm: 600,
    md: 900,
    lg: 1200,
    xl: 1536,
  },
} as const;

type BreakpointValues = typeof breakpoints.values;

type Breakpoint = keyof BreakpointValues;

type OutputString<
  Direction extends BreakpointDirection,
  Start extends Breakpoint,
  End extends Breakpoint
> = Direction extends "between"
  ? `@media(min-width: ${BreakpointValues[Start]}px) and (max-width: ${BreakpointValues[End]}px)`
  : Direction extends "down"
  ? `@media(max-width: ${BreakpointValues[Start]}px)`
  : `@media(min-width: ${BreakpointValues[Start]}px)`;

/**
 * Utility function to generate media queries for responsive design
 */
export const responsive = <
  Direction extends BreakpointDirection,
  Start extends Breakpoint,
  End extends Breakpoint,
  Output extends OutputString<Direction, Start, End> = OutputString<
    Direction,
    Start,
    End
  >
>(
  direction: Direction,
  start: Start,
  end?: End
): Output => {
  const value = breakpoints.values[start];

  if (direction === "between" && end) {
    return `@media(min-width: ${value}px) and (max-width: ${
      breakpoints.values[end || direction]
    }px)` as Output;
  }

  return `@media(${
    direction === "down" ? "max-width" : "min-width"
  }: ${value}px)` as Output;
};

export default breakpoints;
