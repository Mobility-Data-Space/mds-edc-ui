import {ContractAgreement, DataAddress, TransferProcessInput} from "@think-it-labs/edc-connector-client";
import { DataAddressTypes } from "./data-address";
import {transformDataAddress} from "@/utilities/asset.ts";
import {COLORS, HOVER_COLORS} from "@/constants/transfer-process.ts";
import {theme} from "@/theme/ThemeProvider.tsx";

export const TRANSFER_TYPE_PULL = "-PULL" ;
export const TRANSFER_TYPE_PUSH = "-PUSH" ;

export const createTransferProcessRequest = (agreement: ContractAgreement, dataDestination: DataAddress, counterPartyAddress: string) : TransferProcessInput => {
  let transferProcess: TransferProcessInput = {} as TransferProcessInput;

  const transferType = dataDestination.type + (dataDestination.isPull ? TRANSFER_TYPE_PULL : TRANSFER_TYPE_PUSH) ;

  transferProcess.counterPartyAddress = counterPartyAddress,
  transferProcess.contractId = agreement.contractId,
  transferProcess.transferType = transferType

  if (!dataDestination.isPull){
    transferProcess.dataDestination = transformDataAddress(dataDestination)
  }

  if (dataDestination.type === DataAddressTypes.CustomJson) {
    transferProcess.transferType = DataAddressTypes.HttpData + TRANSFER_TYPE_PUSH
  }

  return transferProcess;
}

export const transferProcessStateColor = (state: string) => {
    return COLORS[state] || theme.palette.info.main;
}


export const transferProcessStateHoverColor = (state: string) => {
    return HOVER_COLORS[state] || theme.palette.info.main;
}
