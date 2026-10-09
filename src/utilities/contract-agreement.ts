import type { FieldShowProps } from "@/types/field-show";
import { CONTEXT_EDC } from "@/jsonld/context";
import { formatDateTime } from "@/utilities/date";
import {
  ContractAgreement,
  EdcConnectorClientContext,
  EdcController,
  JsonLdId,
  JsonLdService,
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
      value: `contractAgreements.[id].status${contractAgreement.isTerminated ? "Terminated" : "Active"}`,
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

export class AgreementsRetirementController extends EdcController {
  #basePath = "/v3/contractagreements/retirements";

  constructor(inner: Inner, context: EdcConnectorClientContext) {
    super(inner, context);
  }

  async request(context?: EdcConnectorClientContext) {
    const actualContext = context || this.context!;
    const body = await this.inner.request(actualContext.management, {
      path: `${this.#basePath}/request`,
      method: "POST",
      authorization: actualContext.authorization,
    });

    return await new JsonLdService(
      actualContext.cachedJsonLdContexts,
    ).expandArray(body, () => new RetiredContractAgreement());
  }

  async retire(
    contractAgreementId: string,
    reason: string,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.context!;
    return await this.inner.request(actualContext.management, {
      path: `${this.#basePath}`,
      method: "POST",
      authorization: actualContext.authorization,
      body: {
        "@context": {
          edc: CONTEXT_EDC.value,
        },
        [`${CONTEXT_EDC.value}agreementId`]: contractAgreementId,
        [`${CONTEXT_EDC.value}reason`]: reason,
      },
    });
  }
  async reactivate(
    contractAgreementId: string,
    context?: EdcConnectorClientContext,
  ) {
    const actualContext = context || this.context!;
    return await this.inner.request(actualContext.management, {
      path: `${this.#basePath}/${contractAgreementId}`,
      method: "DELETE",
      authorization: actualContext.authorization,
    });
  }
}
