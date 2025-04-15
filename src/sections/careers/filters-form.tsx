"use client";

import { RHFFormProvider, RHFTextField } from "@elvora/components/react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "qs";
import { Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";

const schema = yup.object().shape({
  search: yup.string().nullable(),
  location: yup.string().nullable(),
  roles: yup.array().of(yup.string()).nullable(),
});

const _CareersPageFiltersForm = (props: CareersPageFiltersFormProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const methods = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      search: "",
      location: "",
      roles: [],
    },
  });

  const onSubmit = methods.handleSubmit((data) => {
    return replace(pathname + qs.stringify(data, { addQueryPrefix: true }));
  });

  const hasRoles = props.roles.length > 0;
  const hasLocations = props.locations.length > 0;

  useEffect(() => {
    methods.reset({
      ...methods.getValues(),
      ...qs.parse(searchParams.toString()),
    });
  }, []);

  return (
    <RHFFormProvider methods={methods} onSubmit={onSubmit} className="filters-form">
      <Stack direction="column" spacing={1.5} flex={1}>
        <RHFTextField name="search" label="Search" fullWidth alternative placeholder="Search by location/ Role..." />

        {!!hasLocations && (
          <RHFTextField name="location" label="Location" select placeholder="Select Location">
            <MenuItem value="" selected>
              Select Location
            </MenuItem>
            {props.locations.map((location, index) => (
              <MenuItem key={index} value={location}>
                {location}
              </MenuItem>
            ))}
          </RHFTextField>
        )}

        {!!hasRoles && (
          <RHFTextField
            name="roles"
            label="Roles"
            select
            slotProps={{
              select: {
                multiple: true,
              },
            }}
            placeholder="Select Roles"
          >
            <MenuItem value="" defaultChecked disabled>
              Select Roles
            </MenuItem>
            {props.roles.map((role, index) => (
              <MenuItem key={index} value={role}>
                {role}
              </MenuItem>
            ))}
          </RHFTextField>
        )}
      </Stack>

      <Stack direction="row" justifyContent="center" mt={3}>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          sx={{
            alignSelf: "center",
          }}
        >
          Apply Filters
        </Button>
      </Stack>
    </RHFFormProvider>
  );
};

export type CareersPageFiltersFormProps = {
  roles: string[];
  locations: string[];
};
const CareersPageFiltersForm: React.FC<CareersPageFiltersFormProps> = (props) => (
  <Suspense>
    <_CareersPageFiltersForm {...props} />
  </Suspense>
);

export { CareersPageFiltersForm };
