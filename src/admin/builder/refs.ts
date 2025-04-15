import { createRef } from "react";
import { FieldDefinition } from "./types";

export const addNewFieldRef = createRef<(field: FieldDefinition) => void>();
export const removeFieldRef = createRef<(index: number) => void>();
