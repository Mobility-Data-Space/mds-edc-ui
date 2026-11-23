import {
  ContractAgreement,
  DataAddress,
  TransferProcessInput,
} from "@think-it-labs/edc-connector-client";
import { DataAddressTypes } from "@/utilities/data-address";
import { transformDataAddress } from "@/domain/asset/mapper";
import {
  BG_COLORS,
  BG_HOVER_COLORS,
  TEXT_COLORS,
} from "@/constants/transfer-process";
import { theme } from "@/theme/theme-provider";

const TRANSFER_TYPE_PULL = "-PULL";
const TRANSFER_TYPE_PUSH = "-PUSH";

// EDC 1.0 removed `dataDestination` from the transfer request: the consumer
// passes the destination as `dataplaneMetadata.properties` (an `@json` literal,
// so keys go through as-is), and the connector turns it into the destination
// data address during the prepare phase. The address type comes from the
// transfer type when no `edc:type` key is present.
const toDataplaneMetadata = (dataDestination: DataAddress) => {
  const properties = Object.fromEntries(
    Object.entries(transformDataAddress(dataDestination)).filter(
      ([key]) => !key.startsWith("@"),
    ),
  );
  return { "@type": "DataplaneMetadata", properties };
};

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
    transferProcess.dataplaneMetadata = toDataplaneMetadata(dataDestination);
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
