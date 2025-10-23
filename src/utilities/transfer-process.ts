import {
  ContractAgreement,
  DataAddress,
  TransferProcessInput,
} from "@think-it-labs/edc-connector-client";
import { DataAddressTypes } from "./data-address";
import { transformDataAddress } from "@/utilities/asset.ts";
import {
  BG_COLORS,
  BG_HOVER_COLORS,
  TEXT_COLORS,
} from "@/constants/transfer-process.ts";
import { theme } from "@/theme/ThemeProvider.tsx";

export const TRANSFER_TYPE_PULL = "-PULL";
export const TRANSFER_TYPE_PUSH = "-PUSH";

type TransferProcessInputWithCallback = TransferProcessInput & {
  callbackAddresses: {
    "@type": "CallbackAddress";
    transactional: boolean;
    uri: string;
    events: string;
  }[];
};

export const createTransferProcessRequest = (
  agreement: ContractAgreement,
  dataDestination: DataAddress,
  counterPartyAddress: string,
): TransferProcessInput => {
  let transferProcess: TransferProcessInputWithCallback =
    {} as TransferProcessInputWithCallback;

  const transferType =
    dataDestination.type +
    (dataDestination.isPull ? TRANSFER_TYPE_PULL : TRANSFER_TYPE_PUSH);

  ((transferProcess.counterPartyAddress = counterPartyAddress),
    (transferProcess.contractId = agreement.contractId),
    (transferProcess.transferType = transferType));

  if (!dataDestination.isPull) {
    transferProcess.dataDestination = transformDataAddress(dataDestination);
  }

  if (transferType === DataAddressTypes.Kafka + TRANSFER_TYPE_PULL) {
    transferProcess.callbackAddresses = [
      {
        "@type": "CallbackAddress",
        transactional: dataDestination.isTransactional,
        uri: dataDestination.uri,
        events: "transfer.process.start",
      },
    ];
  }

  if (dataDestination.type === DataAddressTypes.CustomJson) {
    transferProcess.transferType =
      DataAddressTypes.HttpData + TRANSFER_TYPE_PUSH;
  }

  return transferProcess;
};

export const transferProcessStateBgColor = (state: string) => {
  return BG_COLORS[state] || theme.palette.info.contrastText;
};

export const transferProcessStateTextColor = (state: string) => {
  return TEXT_COLORS[state] || theme.palette.info.main;
};

export const transferProcessStateHoverColor = (state: string) => {
  return BG_HOVER_COLORS[state] || theme.palette.info.main;
};
