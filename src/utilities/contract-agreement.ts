import { FieldShowProps } from "@/components/molecules/field-show";
import { CONTEXT_EDC, TRACTUS_X_CONTEXT } from "@/jsonld/context";
import { formatDateTime } from "@/utilities/date.ts";
import {
  ContractAgreement,
  expandArray,
  JsonLdId,
} from "@think-it-labs/edc-connector-client";
import { Inner } from "@think-it-labs/edc-connector-client/dist/src/inner";

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
      value: "",
      icon: "sync",
    },
  ];
};

export class RetiredContractAgreement extends JsonLdId {
  get agreementId(): string {
    return this.mandatoryValue("edc", "agreementId");
  }

  get agreementRetirementDate(): number {
    return this.mandatoryValue("edc", "agreementRetirementDate");
  }

  get reason(): string {
    return this.mandatoryValue("edc", "reason");
  }
}

export class AgreementsRetirementController {
  #inner: Inner;
  #management: string;
  #pathPrefix = "/v3/contractagreements/retirements";
  protocol: String = "dataspace-protocol-http:2025-1";

  constructor(management: string) {
    this.#inner = new Inner();
    this.#management = management;
  }

  async retiredAgreementsRequest(): Promise<RetiredContractAgreement[]> {
    const body = await this.#inner.request(this.#management, {
      path: `${this.#pathPrefix}/request`,
      method: "POST",
    });

    return await expandArray(body, () => new RetiredContractAgreement());
  }

  async retireAgreement(contractAgreementId: string, reason: string) {
    return await this.#inner.request(this.#management, {
      path: `${this.#pathPrefix}`,
      method: "POST",
      body: {
        "@context": {
          edc: CONTEXT_EDC.value,
        },
        [`${CONTEXT_EDC.value}agreementId`]: contractAgreementId,
        [`${CONTEXT_EDC.value}reason`]: reason,
      },
    });
  }

  async reactivateRetired(contractAgreementId: string) {
    return await this.#inner.request(this.#management, {
      path: `${this.#pathPrefix}/${contractAgreementId}`,
      method: "DELETE",
    });
  }
}
