import {ContractAgreement, DataAddress, TransferProcessInput} from "@think-it-labs/edc-connector-client";
import {DATA_ADDRESS_TYPE_HTTP} from "@/constants/data-address-types.ts";

export const TRANSFER_PROCESS_HTTP_SHOW_AUTH_HEADER = "showAuthHeader"
export const TRANSFER_PROCESS_SHOW_ALL_HTTP_PARAMETERIZATION_FIELDS = "showAllHttpParameterizationFields"

export const defaultDataDestination: DataAddress = {
    type: DATA_ADDRESS_TYPE_HTTP.value,
    method: 'POST',
    authCode: '',
    authKey: ''
}

export const createTransferProcessRequest = (agreement: ContractAgreement, transferType: string, destinationAddress: DataAddress, counterPartyAddress: string) : TransferProcessInput => {
    const transfer: TransferProcessInput = {
        assetId: agreement.assetId,
        counterPartyAddress: counterPartyAddress,
        contractId: agreement.contractId,
        transferType: transferType,
        dataDestination: destinationAddress
    };

    return transfer ;
}
