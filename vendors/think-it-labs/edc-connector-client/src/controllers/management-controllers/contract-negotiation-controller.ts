import {Inner} from "@think-it-labs/edc-connector-client/dist/src/inner";
import {EdcConnectorClientContext} from "@think-it-labs/edc-connector-client";

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
// TODO: api token
      body: {
        "edc:agreementId": contractAgreementId,
// TODO: "tx:reason"
      }
    });
  }

  async reactivateRetired(contractAgreementId: string) {
    return this.#inner.request(this.#management, {
      path: `/v3.1alpha/retireagreements/${contractAgreementId}`,
      method: "DELETE"
      // TODO: api token
    });
  }
}
