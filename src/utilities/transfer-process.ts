import {ContractAgreement, DataAddress, TransferProcessInput} from "@think-it-labs/edc-connector-client";
import { DataAddressTypes } from "./data-address";
import {transformDataAddress} from "@/utilities/asset.ts";
import {COLORS, HOVER_COLORS} from "@/constants/transfer-process.ts";
import {theme} from "@/theme/ThemeProvider.tsx";

export const TRANSFER_TYPE_PULL = "-PULL" ;
export const TRANSFER_TYPE_PUSH = "-PUSH" ;

export const createTransferProcessRequest = (agreement: ContractAgreement, dataDestination: DataAddress, counterPartyAddress: string) : TransferProcessInput => {
  const typeIsHttpData = dataDestination.type === DataAddressTypes.HttpData;
  const transferType = typeIsHttpData ?
    DataAddressTypes.HttpData + (dataDestination.isPull ? TRANSFER_TYPE_PULL : TRANSFER_TYPE_PUSH) :
    dataDestination.type;

  return {
    assetId: agreement.assetId,
    counterPartyAddress: counterPartyAddress,
    contractId: agreement.contractId,
    dataDestination: typeIsHttpData && dataDestination.isPull ? { type: DataAddressTypes.HttpData } : transformDataAddress(dataDestination),
    transferType,
  };
}

export const transferProcessStateColor = (state: string) => {
    return COLORS[state] || theme.palette.info.main;
}


export const transferProcessStateHoverColor = (state: string) => {
    return HOVER_COLORS[state] || theme.palette.info.main;
}
