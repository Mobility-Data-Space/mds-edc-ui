import { ContractAgreement } from "@think-it-labs/edc-connector-client";

export class EnrichedContractAgreement extends ContractAgreement {
  constructor() {
    super();
  }

  get isTerminated(): boolean | undefined {
    return this.optionalValue("edc", "isTerminated");
  }

  get isRunning(): boolean | undefined {
    return this.optionalValue("edc", "isRunning");
  }

  get transferCount(): number | undefined {
    return this.optionalValue("edc", "transferCount");
  }

  get isTerminatedAt(): number | undefined {
    return this.optionalValue("edc", "isTerminatedAt");
  }

  get terminationReason(): string | undefined {
    return this.optionalValue("edc", "terminationReason");
  }

  get assetTitle(): string | null | undefined {
    return this.optionalValue("edc", "assetTitle");
  }
}
