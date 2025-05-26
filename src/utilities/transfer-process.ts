import {ContractAgreement, DataAddress, TransferProcessInput} from "@think-it-labs/edc-connector-client";
import { DataAddressTypes } from "./data_address";

export const TRANSFER_TYPE_PULL = "_PULL" ;
export const TRANSFER_TYPE_PUSH = "_PUSH" ;

export const createTransferProcessRequest = (agreement: ContractAgreement, transferType: DataAddressTypes, destinationAddress: DataAddress, counterPartyAddress: string) : TransferProcessInput => {
    const transfer: TransferProcessInput = {
        assetId: agreement.assetId,
        counterPartyAddress: counterPartyAddress,
        contractId: agreement.contractId,
        transferType: transferType + TRANSFER_TYPE_PULL,
        dataDestination: destinationAddress
    };

    return transfer ;
}
