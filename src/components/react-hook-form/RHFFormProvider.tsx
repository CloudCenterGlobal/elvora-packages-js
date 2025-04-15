"use client";

import { FieldValues, FormProvider, FormProviderProps, UseFormHandleSubmit } from "react-hook-form";

const RHFFormProvider = <
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
  Nowrap extends boolean = false,
>({
  children,
  noWrap,
  methods,
  onSubmit,
  ...props
}: RHFFormProviderProps<TFieldValues, TContext, TTransformedValues, Nowrap>) => {
  if (noWrap) return <FormProvider {...methods}>{children}</FormProvider>;

  return (
    <form noValidate onSubmit={onSubmit} {...props}>
      <FormProvider {...methods}>{children}</FormProvider>
    </form>
  );
};

type BaseFormProps = Omit<React.ComponentProps<"form">, "onSubmit">;

export type RHFFormProviderProps<
  TFieldValues extends FieldValues = FieldValues,
  TContext = any,
  TTransformedValues extends FieldValues | undefined = undefined,
  Nowrap extends boolean = false,
> = BaseFormProps & {
  children: React.ReactNode | React.ReactNode[];
  methods: Omit<FormProviderProps<TFieldValues, TContext, TTransformedValues>, "children">;

  /** If true, the form will not be wrapped in a form element */
  noWrap?: Nowrap;
} & (Nowrap extends true
    ? {
        onSubmit?: never;
      }
    : {
        onSubmit: ReturnType<UseFormHandleSubmit<TFieldValues>>;
      });

export { RHFFormProvider };
