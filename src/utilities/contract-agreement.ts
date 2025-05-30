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
      value: "", // TODO: implement
      icon: "link"
    },
    {
      label: "contractAgreements.status",
      value: "", // TODO: implement
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

export class AgreementsRetirementController {
  #inner: Inner;
  #management: string;
  protocol: String = "dataspace-protocol-http";

  constructor(management: string) {
    this.#inner = new Inner();
    this.#management = management;
    console.log('mdsContractNegotiationController', { thiss: this, innerrr: this.#inner, });
  }

  async retireAgreement(contractAgreementId: string) {
    console.log('retire', contractAgreementId)
    return this.#inner.request(this.#management, {
      path: "/v3.1alpha/retireagreements",
      method: "POST",
      body: {
        "edc:agreementId": contractAgreementId,
        "tx:reason": "reason"
      }
    });
  }

  async reactivateRetired(contractAgreementId: string) {
    return this.#inner.request(this.#management, {
      path: `/v3.1alpha/retireagreements/${contractAgreementId}`,
      method: "DELETE"
    });
  }
}
