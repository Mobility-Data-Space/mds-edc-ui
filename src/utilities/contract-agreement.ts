import type { FieldShowProps } from "@/types/field-show";
import { formatDateTime } from "@/utilities/date";
import { ContractAgreement } from "@think-it-labs/edc-connector-client";

export const contractAgreementFieldsToShow = (
  contractAgreement: ContractAgreement,
  participantId: string,
  counterPartyAddress: string,
): FieldShowProps[] => {
  return [
    {
      label: "contractAgreements.signed",
      value: formatDateTime(contractAgreement.contractSigningDate * 1000),
      icon: "category",
    },
    {
      label: "contractAgreements.direction",
      value:
        contractAgreement.providerId === participantId
          ? "contractAgreements.providing"
          : "contractAgreements.consuming",
      icon: "policy",
    },
    {
      label: "contractAgreements.contractAgreementId",
      value: contractAgreement.id,
      icon: "category",
    },
    {
      label: "contractAgreements.otherConnectorId",
      value: participantId,
      icon: "link",
    },
    {
      label: "contractAgreements.counterPartyConnectorEndpoint",
      value: counterPartyAddress,
      icon: "link",
    },
    {
      label: "contractAgreements.status",
      value: `contractAgreements.[id].status${contractAgreement.isTerminated ? "Terminated" : "Active"}`,
      icon: "sync",
    },
  ];
};
