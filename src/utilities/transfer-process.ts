import {
  ContractAgreement,
  DataAddress,
  TransferProcessInput,
} from "@think-it-labs/edc-connector-client";
import { DataAddressTypes } from "@/utilities/data-address";
import {
  toDataplaneMetadata,
  transformDataAddress,
} from "@/domain/asset/mapper";
import {
  BG_COLORS,
  BG_HOVER_COLORS,
  TEXT_COLORS,
} from "@/constants/transfer-process";
import { theme } from "@/theme/theme-provider";

const TRANSFER_TYPE_PULL = "-PULL";
const TRANSFER_TYPE_PUSH = "-PUSH";

export const createTransferProcessRequest = (
  agreement: ContractAgreement,
  dataDestination: DataAddress,
  counterPartyAddress: string,
): TransferProcessInput => {
  const transferProcess = {} as TransferProcessInput;

  const transferType =
    dataDestination.type +
    (dataDestination.isPull ? TRANSFER_TYPE_PULL : TRANSFER_TYPE_PUSH);

  transferProcess.counterPartyAddress = counterPartyAddress;
  transferProcess.contractId = agreement.contractId;
  transferProcess.transferType = transferType;

  if (!dataDestination.isPull) {
    // EDC 1.0 dropped `dataDestination`: the consumer passes the destination as
    // `dataplaneMetadata` and the connector builds the destination address from
    // it during the prepare phase.
    transferProcess.dataplaneMetadata = toDataplaneMetadata(
      transformDataAddress(dataDestination),
    );
  }

  if (transferType === DataAddressTypes.Kafka + TRANSFER_TYPE_PULL) {
    if (dataDestination.isTransactional) {
      transferProcess.callbackAddresses = [
        {
          "@type": "CallbackAddress",
          transactional: dataDestination.isTransactional,
          uri: dataDestination.uri,
          events: ["transfer.process.start"],
        },
      ];
    }
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
