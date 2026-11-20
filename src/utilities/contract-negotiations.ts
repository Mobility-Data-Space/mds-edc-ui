import {
  ContractNegotiationRequest,
  Policy,
  PolicyBuilder,
} from "@think-it-labs/edc-connector-client";

export const createNegotiationRequest = (
  offer: Policy,
  counterPartyAddress: string,
  counterPartyId: string,
  assetId: string,
): ContractNegotiationRequest => {
  return {
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
};
