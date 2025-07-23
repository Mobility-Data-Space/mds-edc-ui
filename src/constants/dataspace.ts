export interface Participant {
  id: string;
  name: string;
  description?: string;
  edcUrl: string; // public url
  managementUrl: string;
  connectorManagementUrl: string;
  defaultUrl: string;
  protocolUrl: string;
  curatorName: string,
  curatorUrl: string,
  maintainerName: string,
  maintainerUrl: string,
  dapsUrl: string
}

