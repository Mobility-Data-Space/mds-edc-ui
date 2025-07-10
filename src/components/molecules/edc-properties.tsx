import React from "react";
import {Card, CardContent} from "@mui/material";
import {T} from "@/i18n";
import {TitleWithIcon} from "@/components/atoms/TitleWithIcon.tsx";
import FieldGrid from "@/components/molecules/field-grid.tsx";
import {FieldShowProps} from "@/components/molecules/field-show.tsx";

export interface EdcPropertiesProps {
  fields: FieldShowProps[],
}

export function EdcProperties({ fields }: EdcPropertiesProps ): JSX.Element {
  return (
    <Card data-testid="dashboard-edc-properties" >
      <CardContent className="flex flex-col gap-y-4">
        <TitleWithIcon
          title={<T string="dashboard.connectorProperties"/>}
          subtitle={<T string="dashboard.additionalProperties" />}
        />
        <FieldGrid fields={fields} contentClassName="!md:grid-cols-2 lg:grid-cols-3"/>
      </CardContent>
    </Card>
  );
}
