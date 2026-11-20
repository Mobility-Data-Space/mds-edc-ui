import { ContractAgreement } from "@think-it-labs/edc-connector-client";

export class EnrichedContractAgreement extends ContractAgreement {
  constructor() {
    super();
  }

  // Retirement is carried by the agreement itself (EDC >= 1.0); these read the
  // connector's own fields, named like edc-connector-client's next
  // `ContractAgreement` interface.
  get retired(): boolean {
    return this.optionalValue<boolean>("edc", "retired") === true;
  }

  get retirementReason(): string | undefined {
    return this.optionalValue("edc", "retirementReason");
  }

  /** Epoch seconds; only set on a retired agreement. */
  get retirementDate(): number | undefined {
    return this.optionalValue("edc", "retirementDate");
  }

  get isRunning(): boolean | undefined {
    return this.optionalValue("edc", "isRunning");
  }

  get transferCount(): number | undefined {
    return this.optionalValue("edc", "transferCount");
  }

  get assetTitle(): string | null | undefined {
    return this.optionalValue("edc", "assetTitle");
  }
}
