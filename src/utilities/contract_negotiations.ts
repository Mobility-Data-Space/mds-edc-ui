import { ContractDefinition, ContractNegotiationRequest, PolicyBuilder } from "@think-it-labs/edc-connector-client";

export const createNegotiationRequest = (offer: ContractDefinition) : ContractNegotiationRequest => {
    const negotiation: ContractNegotiationRequest = {
        counterPartyAddress: "" ,
        policy: new PolicyBuilder().type("Set").build()
    };

    return negotiation ;
}