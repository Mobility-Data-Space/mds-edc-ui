export interface Participant {
  id: string;
  name: string;
  managementUrl: string;
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
  ["circular-economy", {
    integration: [
      {
        id: "zf-circular-economy-integration",
        name: "ZF Circular economy (integration)",
        managementUrl: "http://localhost:3000/api/3001/management",
        defaultUrl: "http://localhost:3000/api/8860/api",
        protocolUrl: "http://zf-circular-economy-integration:9194/protocol",
      },
    ],
    production: [
      {
        id: "zf-circular-economy-production",
        name: "ZF Circular economy (production)",
        managementUrl: "http://localhost:3000/api/3003/management",
        defaultUrl: "http://localhost:3000/api/8870/api",
        protocolUrl: "http://zf-circular-economy-production:9194/protocol",
      },
    ],
  }],
  ["quality", {
    development: [
      {
        id: "bosh-quality-development",
        name: "Bosh Quality (development)",
        managementUrl: "http://localhost:3000/api/3006/management",
        defaultUrl: "http://localhost:3000/api/8840/api",
        protocolUrl: "http://bosh-quality-development:9194/protocol",
      },
      {
        id: "zf-quality-development",
        name: "ZF Quality (development)",
        managementUrl: "http://localhost:3000/api/3009/management",
        defaultUrl: "http://localhost:3000/api/8880/api",
        protocolUrl: "http://zf-quality-development:9194/protocol",
      },
    ],
    integration: [
      {
        id: "bosh-quality-integration",
        name: "Bosh Quality (integration)",
        managementUrl: "http://localhost:3000/api/3008/management",
        defaultUrl: "http://localhost:3000/api/8850/api",
        protocolUrl: "http://bosh-quality-integration:9194/protocol",
      },
    ],
  }],
]);
