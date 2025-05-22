import { ContractNegotiationRequest, Offer, Policy, PolicyBuilder } from "@think-it-labs/edc-connector-client";

export const createNegotiationRequest = (offer: Policy, counterPartyAddress:string) : ContractNegotiationRequest => {
    const negotiation: ContractNegotiationRequest = {
        counterPartyAddress: counterPartyAddress ,
        policy: new PolicyBuilder().type("Offer").raw({
            ...offer,
            assigner: "A",
            target: "T"
        }).build()
    };
    console.log(negotiation)
    return negotiation ;
}