import type { SnackbarProvider } from "notistack";
import { createRef } from "react";

const notistackRef = createRef<SnackbarProvider>();

export { notistackRef };
