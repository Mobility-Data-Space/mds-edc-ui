import { ContractNegotiationRequest, Policy, PolicyBuilder } from "@think-it-labs/edc-connector-client";

export const createNegotiationRequest = (offer: Policy, counterPartyAddress:string, participantId: string, assetId: string) : ContractNegotiationRequest => {
    const negotiation: ContractNegotiationRequest = {
        counterPartyAddress: counterPartyAddress,
        policy: new PolicyBuilder().type("Offer").raw({
            ...offer,
            assigner: participantId,
            target: assetId
        }).build()
    };
    return negotiation ;
}