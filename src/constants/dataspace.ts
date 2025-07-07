export interface Participant {
  id: string;
  name: string;
  description?: string;
  edcUrl?: string; // public url
  managementUrl: string;
  connectorManagementUrl?: string;
  defaultUrl: string;
  protocolUrl: string;
}

class Dataspace {
  #inner: Map<string, Record<string, Participant[]>> = new Map();
  constructor(
    entries?:
      | readonly (readonly [string, Record<string, Participant[]>])[]
      | null,
  ) {
    this.#inner = new Map(entries);
  }

  findParticipant(
    useCase: string,
    environment: string,
    participantId: string,
  ): Participant | undefined {
    return this.#inner.get(useCase)?.[environment]?.find(({ id }) =>
      id === participantId
    );
  }

  filter(
    useCase: string,
    environment: string,
    fn: (item: Participant, index: number, array: Participant[]) => boolean,
  ): Participant[] {
    return this.#inner.get(useCase)?.[environment]?.filter(fn) ?? [];
  }

  map<T>(
    useCase: string,
    environment: string,
    fn: (item: Participant, index: number, array: Participant[]) => T,
  ): T[] {
    return this.#inner.get(useCase)?.[environment]?.map(fn) ?? [];
  }
}

export const DATASPACE = new Dataspace([
  ["mobility-data-space", {
    local: [
      {
        id: "mds-local",
        name: "MDS UI (local)",
        edcUrl: "localhost:3000",
        managementUrl: "http://localhost:3000/api/3001/management",
        connectorManagementUrl: "http://localhost:3000/api/3001/management",
        defaultUrl: "http://localhost:3000/api/8860/api",
        protocolUrl: "http://zf-circular-economy-integration:9194/protocol",
      },
    ],
    dev: [
      {
        id: "mds-dev",
        name: "MDS UI (dev)",
        edcUrl: "localhost:3000",
        managementUrl: "http://localhost:3000/api/3001/management",
        connectorManagementUrl: "http://localhost:3000/api/3001/management",
        defaultUrl: "http://localhost:3000/api/8860/api",
        protocolUrl: "http://zf-circular-economy-integration:9194/protocol",
      },
    ],
    prod: [
      {
        id: "mds-prod",
        name: "MDS UI (prod)",
        edcUrl: "localhost:3000",
        managementUrl: "http://localhost:3000/api/3003/management",
        connectorManagementUrl: "http://localhost:3000/api/3003/management",
        defaultUrl: "http://localhost:3000/api/8870/api",
        protocolUrl: "http://zf-circular-economy-production:9194/protocol",
      },
    ],
  }]
]);
