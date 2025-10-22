import {
  ContractNegotiationRequest,
  expand,
  IdResponse,
  Policy,
  PolicyBuilder,
} from "@think-it-labs/edc-connector-client";
import { Inner } from "@think-it-labs/edc-connector-client/dist/src/inner";

export const createNegotiationRequest = (
  offer: Policy,
  counterPartyAddress: string,
  counterPartyId: string,
  assetId: string,
): ContractNegotiationRequest => {
  const negotiation: ContractNegotiationRequest = {
    counterPartyAddress: counterPartyAddress,
    policy: new PolicyBuilder()
      .type("Offer")
      .raw({
        ...offer,
        assigner: counterPartyId,
        target: assetId,
      })
      .build(),
  };
  return negotiation;
};

export class MDSManualApprovalController {
  #inner: Inner;
  #management: string;
  protocol: String = "dataspace-protocol-http:2025-1";

  constructor(management: string) {
    this.#inner = new Inner();
    this.#management = management;
  }

  async approve(contractNegotiationId: string): Promise<void> {
    return this.#inner.request(this.#management, {
      path: `/v3/contractnegotiations/${contractNegotiationId}/approve`,
      method: "POST",
      body: {},
    });
  }

  async reject(contractNegotiationId: string): Promise<void> {
    return this.#inner.request(this.#management, {
      path: `/v3/contractnegotiations/${contractNegotiationId}/reject`,
      method: "POST",
      body: {},
    });
  }
}
