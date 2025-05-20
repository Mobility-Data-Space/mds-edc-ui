import { ContractAgreement, TransferProcessInput } from "@think-it-labs/edc-connector-client";

export const createTransferProcessRequest = (agreement: ContractAgreement) : TransferProcessInput => {
    const transfer: TransferProcessInput = {
        assetId: "",
        counterPartyAddress: "",
        contractId: "",
        transferType: ""
    };

    return transfer ;
}