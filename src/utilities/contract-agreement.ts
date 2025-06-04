import {Inner} from "@think-it-labs/edc-connector-client/dist/src/inner";
import {ContractAgreement} from "@think-it-labs/edc-connector-client";
import {FieldShowProps} from "@/components/molecules/field-show";
import {TransferProcess} from "@think-it-labs/edc-connector-client/dist/src/entities";
import {removeJsonLdSchemaFromProperties} from "@/utilities/catalog";

export const contractAgreementFieldsToShow = (contractAgreement: ContractAgreement, participantId: string): FieldShowProps[] => {

  return [
    {
      label: "contractAgreements.signed",
      value: new Date(contractAgreement.contractSigningDate * 1000).toString(),
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
      value: "",
      icon: "link"
    },
    {
      label: "contractAgreements.status",
      value: "",
      icon: "sync"
    },
  ];
};

export const transferProcessesFieldsToShow = (transferProcesses: TransferProcess[]) => {

  return transferProcesses.map((transferProcess: TransferProcess) => {
    const object = removeJsonLdSchemaFromProperties(transferProcess);
    const stateTimestamp = object.stateTimestamp && object.stateTimestamp[0] && object.stateTimestamp[0]["@value"];
    const date = new Date(stateTimestamp).toString();

    return {
      label: `${date} - ${transferProcess.state}`,
      value: transferProcess.id,
      icon: transferProcess.type === "CONSUMER" ? "file_download" : "file_upload",
    };
  });
}

export interface RetiredContractAgreement {
  agreementId: string;
  "https://w3id.org/tractusx/v0.0.1/ns/agreementRetirementDate": number;
  "https://w3id.org/tractusx/v0.0.1/ns/reason": string;
}

export class AgreementsRetirementController {
  #inner: Inner;
  #management: string;
  #pathPrefix = "/v3.1alpha/retireagreements";
  protocol: String = "dataspace-protocol-http";

  constructor(management: string) {
    this.#inner = new Inner();
    this.#management = management;
  }

  async retiredAgreementsRequest(): Promise<RetiredContractAgreement[]> {
    return this.#inner.request(this.#management, {
      path: `${this.#pathPrefix}/request`,
      method: "POST",
    });
  }

  async retireAgreement(contractAgreementId: string, reason: string) {
    return this.#inner.request(this.#management, {
      path: `${this.#pathPrefix}`,
      method: "POST",
      body: {
        "@context": {
          "tx": "https://w3id.org/tractusx/v0.0.1/ns/",
          "edc": "https://w3id.org/edc/v0.0.1/ns/"
        },
        "edc:agreementId": contractAgreementId,
        "tx:reason": reason
      }
    });
  }

  async reactivateRetired(contractAgreementId: string) {
    return this.#inner.request(this.#management, {
      path: `${this.#pathPrefix}/${contractAgreementId}`,
      method: "DELETE"
    });
  }
}
