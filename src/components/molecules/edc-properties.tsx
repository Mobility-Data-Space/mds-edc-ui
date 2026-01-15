import { TitleWithIcon } from "@/components/atoms/TitleWithIcon.tsx";
import FieldGrid from "@/components/molecules/field-grid.tsx";
import { FieldShowProps } from "@/components/molecules/field-show.tsx";
import { T } from "@/i18n";
import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

export interface EdcPropertiesProps {
  fields: FieldShowProps[],
  versionFields?: FieldShowProps[],
}

export function EdcProperties({ fields, versionFields }: EdcPropertiesProps): React.ReactElement {
  return (
    <Card data-testid="dashboard-edc-properties" >
      <CardContent className="flex flex-col gap-y-4">
        <TitleWithIcon
          title={<T string="dashboard.connectorProperties" />}
          subtitle={<T string="dashboard.additionalProperties" />}
        />
        <FieldGrid fields={fields} contentClassName="!md:grid-cols-2 lg:grid-cols-3" />

        {versionFields && versionFields.length > 0 && (
          <>
            <Typography variant="h6" className="!text-sm !font-medium !text-gray-600 !uppercase !tracking-wide !mt-4">
              <T string="dashboard.versionInformation" />
            </Typography>
            <FieldGrid fields={versionFields} contentClassName="!md:grid-cols-2 lg:grid-cols-3" />
          </>
        )}
      </CardContent>
    </Card>
  );
}
