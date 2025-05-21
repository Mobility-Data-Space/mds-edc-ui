import {ContractAgreement, DataAddress, TransferProcessInput} from "@think-it-labs/edc-connector-client";
import {ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VAULT_SECRET} from "@/schema/asset.ts";
import {DATA_ADDRESS_TYPE_HTTP} from "@/constants/data-address-types.ts";
import {TRANSFER_PROCESS_DATA_ADDRESS_TYPE, TRANSFER_PROCESS_DATA_DESTINATION, TRANSFER_PROCESS_HTTP_AUTH_HEADER_NAME, TRANSFER_PROCESS_HTTP_AUTH_HEADER_TYPE, TRANSFER_PROCESS_HTTP_AUTH_HEADER_VALUE, TRANSFER_PROCESS_HTTP_HEADERS, TRANSFER_PROCESS_HTTP_METHOD, TRANSFER_PROCESS_HTTP_PROXIED_BODY, TRANSFER_PROCESS_HTTP_PROXIED_BODY_CONTENT_TYPE, TRANSFER_PROCESS_HTTP_PROXIED_METHOD, TRANSFER_PROCESS_HTTP_PROXIED_PATH, TRANSFER_PROCESS_HTTP_PROXIED_QUERY_PARAMS, TRANSFER_PROCESS_HTTP_URL, TRANSFER_PROCESS_HTTP_SHOW_AUTH_HEADER, TRANSFER_PROCESS_SHOW_ALL_HTTP_PARAMETERIZATION_FIELDS} from "@/schema/transfer-process.ts";

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
