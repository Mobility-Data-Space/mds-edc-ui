import { FieldShowProps } from "@/components/molecules/field-show";
import { CONTEXT_EDC, TRACTUS_X_CONTEXT } from "@/jsonld/context";
import { ContractAgreement, EdcConnectorClientContext, EdcController } from "@think-it-labs/edc-connector-client";
import { Inner } from "@think-it-labs/edc-connector-client/dist/src/inner";
import { formatDateTime } from "@/utilities/date.ts";

export const contractAgreementFieldsToShow = (contractAgreement: ContractAgreement, participantId: string, counterPartyAddress: string): FieldShowProps[] => {
  return [
    {
      label: "contractAgreements.signed",
      value: formatDateTime(contractAgreement.contractSigningDate * 1000),
      icon: "category"
    },
    {
      label: "contractAgreements.direction",
      value: contractAgreement.providerId === participantId ? "contractAgreements.providing" : "contractAgreements.consuming",
      icon: "policy"
    },
    {
      label: "contractAgreements.contractAgreementId",
      value: contractAgreement.id,
      icon: "category"
    },
    {
      label: "contractAgreements.otherConnectorId",
      value: participantId,
      icon: "link"
    },
    {
      label: "contractAgreements.counterPartyConnectorEndpoint",
      value: counterPartyAddress,
      icon: "link"
    },
    {
      label: "contractAgreements.status",
      value: "",
      icon: "sync"
    },
  ];
};

export const AGREEMENT_RETIREMENT_DATE = `${TRACTUS_X_CONTEXT.value}agreementRetirementDate`;
export const AGREEMENT_RETIREMENT_REASON = `${TRACTUS_X_CONTEXT.value}reason`;

export interface RetiredContractAgreement {
  agreementId: string;
  [AGREEMENT_RETIREMENT_DATE]: number;
  [AGREEMENT_RETIREMENT_REASON]: string;
}

export class AgreementsRetirementController extends EdcController {
  #pathPrefix = "/v3/contractagreements/retirements";
  protocol: String = "dataspace-protocol-http";

  constructor(inner: Inner, context?: EdcConnectorClientContext) {
    super(inner, context)
  }

  async retiredAgreementsRequest(context?: EdcConnectorClientContext): Promise<RetiredContractAgreement[]> {
    const actualContext = this.context || context!
    return this.inner.request(actualContext.management, {
      path: `${this.#pathPrefix}/request`,
      method: "POST",
    });
  }

  async retireAgreement(contractAgreementId: string, reason: string, context?: EdcConnectorClientContext) {
    const actualContext = this.context || context!
    return this.inner.request(actualContext.management, {
      path: `${this.#pathPrefix}`,
      method: "POST",
      body: {
        "@context": {
          "tx": TRACTUS_X_CONTEXT.value,
          "edc": CONTEXT_EDC.value
        },
        "edc:agreementId": contractAgreementId,
        "tx:reason": reason
      }
    });
  }

  async reactivateRetired(contractAgreementId: string, context?: EdcConnectorClientContext) {
    const actualContext = this.context || context!
    return this.inner.request(actualContext.management, {
      path: `${this.#pathPrefix}/${contractAgreementId}`,
      method: "DELETE"
    });
  }
}
