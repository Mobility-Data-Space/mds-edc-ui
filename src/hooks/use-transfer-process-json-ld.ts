import {TransferProcess} from "@think-it-labs/edc-connector-client/dist/src/entities";
import {ContractNegotiation} from "@think-it-labs/edc-connector-client";
import {useMemo} from "react";

export const useTransferProcessJsonLd = (transferProcess: TransferProcess, contractNegotiation: ContractNegotiation) => {
  return useMemo(() => {
    const additionalTransferProcessFields: Record<string, unknown> = {};
    Object.entries(contractNegotiation).forEach(([key, value]) => {
      if (key.includes("counterPartyId") || key.includes("counterPartyAddress")) {
        additionalTransferProcessFields[key] = value;
      }
    });

    const auxJsonLdObject: Record<string, unknown> = {
      ...transferProcess,
      ...additionalTransferProcessFields,
    };
    const jsonLdObject: Record<string, unknown> = {};
    Object.keys(auxJsonLdObject).sort().forEach(async (key) => {
      jsonLdObject[key] = auxJsonLdObject[key];
    });

    return jsonLdObject;
  }, [transferProcess, contractNegotiation]);
};
