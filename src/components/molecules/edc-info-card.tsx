import { EdcInfoDisplayInput } from "@/components/atoms/edc-info-display-input.tsx";
import { TitleWithIcon } from "@/components/atoms/TitleWithIcon.tsx";
import { T } from "@/i18n";
import { Card, CardContent, Typography } from "@mui/material";
import React from "react";

export interface EdcInfoCardProps {
  name: string;
  description?: string;
  managementUrl: string;
  protocolUrl: string;
  translator: (key: string) => string;
}

export function EdcInfoCard({ name, description = "", managementUrl, protocolUrl, translator }: EdcInfoCardProps): React.ReactElement {

  return (
    <Card >
      <CardContent className="flex flex-col gap-y-4">
        <TitleWithIcon
          title={<T string="dashboard.edcConnector" />}
          subtitle={name.toUpperCase()}
        />

        <Typography variant="body2">
          {description}
        </Typography>

        <Typography variant="body2">
          <T string="dashboard.edcDescription" />
        </Typography>

        <EdcInfoDisplayInput
          data-testid="dashboard-connector-endpoint"
          label={<T string="dashboard.connectorEndpoint" />}
          value={protocolUrl}
          translator={translator}
        />

        <EdcInfoDisplayInput
          data-testid="dashboard-management-api-url"
          label={<T string="dashboard.managementApiUrl" />}
          value={managementUrl}
          translator={translator}
        />
      </CardContent>
    </Card>
  );
}
