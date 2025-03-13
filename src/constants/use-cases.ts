import { Participant } from "./dataspace";

interface UseCase {
  id: string;
  name: string;
  environments: Record<string, Participant>;
}

export class UseCases {
  #inner: UseCase[] = [];

  constructor(useCases: UseCase[]) {
    this.#inner = useCases;
  }

  findConnector(
    useCaseId: string,
    environment: string,
  ): Participant | undefined {
    return this.#inner
      .find((useCase) =>
        useCase.id === useCaseId && environment in useCase.environments
      )
      ?.environments[environment];
  }

  map<T>(fn: (item: UseCase, index: number, array: UseCase[]) => T): T[] {
    return this.#inner.map(fn);
  }

  reduce<T>(
    fn: (result: T, item: UseCase, currentIndex: number, array: T[]) => T,
    defaultValue?: T,
  ): T {
    return this.#inner.reduce(fn as any, defaultValue) as T;
  }
}

export const USE_CASES: UseCases = new UseCases([
  {
    id: "circular-economy",
    name: "Circular economy",
    environments: {
      integration: {
        id: "bmw-circular-economy-integration",
        name: "Circular economy (integration)",
        managementUrl: "http://localhost:3000/api/3007/management",
        defaultUrl: "http://localhost:3000/api/8800/api",
        protocolUrl: "http://bmw-quality-integration:9194/protocol",
      },
      production: {
        id: "bmw-circular-economy-production",
        name: "Circular economy (production)",
        managementUrl: "http://localhost:3000/api/8812/management",
        defaultUrl: "http://localhost:3000/api/8810/api",
        protocolUrl: "http://bmw-circular-economy-production:9194/protocol",
      },
    },
  },
  {
    id: "quality",
    name: "Quality",
    environments: {
      development: {
        id: "bmw-quality-development",
        name: "Quality (development)",
        managementUrl: "http://localhost:3000/api/3005/management",
        defaultUrl: "http://localhost:3000/api/8830/api",
        protocolUrl: "http://bmw-quality-development:9194/protocol",
      },
      integration: {
        id: "bmw-quality-integration",
        name: "Quality (integration)",
        managementUrl: "http://localhost:3000/api/3004/management",
        defaultUrl: "http://localhost:3000/api/8830/api",
        protocolUrl: "http://bmw-quality-integration:9194/protocol",
      },
    },
  },
]);
