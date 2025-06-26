import React from "react";
import {Card, CardContent, Typography} from "@mui/material";
import {T} from "@/i18n";
import {EdcInfoDisplayInput} from "@/components/atoms/edc-info-display-input.tsx";
import {TitleWithIcon} from "@/components/atoms/TitleWithIcon.tsx";

export interface EdcInfoCardProps {
  name: string;
  description?: string;
  managementUrl: string;
  protocolUrl: string;
  translator: (key: string) => string;
}

export function EdcInfoCard({ name, description = "", managementUrl, protocolUrl, translator }: EdcInfoCardProps): JSX.Element {

  return (
    <Card >
      <CardContent className="flex flex-col gap-y-4">
        <TitleWithIcon
          title={<T string="dashboard.edcConnector" />}
          subtitle={name}
        />

        <Typography variant="body2">
          {description}
        </Typography>

        <Typography variant="body2">
          <T string="dashboard.edcDescription" />
        </Typography>

        <EdcInfoDisplayInput
          label={<T string="dashboard.connectorEndpoint" />}
          value={protocolUrl}
          translator={translator}
        />

        <EdcInfoDisplayInput
          label={<T string="dashboard.managementApiUrl" />}
          value={managementUrl}
          translator={translator}
        />
      </CardContent>
    </Card>
  );
}
