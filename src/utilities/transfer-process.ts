import {ContractAgreement, DataAddress, TransferProcessInput} from "@think-it-labs/edc-connector-client";
import { DataAddressTypes } from "./data-address";
import {COLORS, HOVER_COLORS} from "@/constants/transfer-process.ts";
import {theme} from "@/theme/ThemeProvider.tsx";

export const TRANSFER_TYPE_PULL = "-PULL" ;
export const TRANSFER_TYPE_PUSH = "-PUSH" ;

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

export const transferProcessStateColor = (state: string) => {
    return COLORS[state] || theme.palette.info.main;
}


export const transferProcessStateHoverColor = (state: string) => {
    return HOVER_COLORS[state] || theme.palette.info.main;
}
