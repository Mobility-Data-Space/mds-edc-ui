import {ContractAgreement, DataAddress, TransferProcessInput} from "@think-it-labs/edc-connector-client";
import { DataAddressTypes } from "./data-address";
import {transformDataAddress} from "@/utilities/asset.ts";

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
