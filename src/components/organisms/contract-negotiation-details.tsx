import {T} from "@/i18n";
import {ContractNegotiation} from "@think-it-labs/edc-connector-client";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld.tsx";
import {removeJsonLdSchemaFromProperties} from "@/utilities/catalog.ts";
import {formatDateTime} from "@/utilities/date.ts";

interface ContractNegotiationDetailsProps {
  contractNegotiation: ContractNegotiation;
}

export default function ContractNegotiationDetails({ contractNegotiation }: ContractNegotiationDetailsProps) {
  const cleanedContractNegotiation = removeJsonLdSchemaFromProperties(contractNegotiation);
  const createdAt = formatDateTime(readValue(cleanedContractNegotiation, "createdAt"), { showSeconds: true, showDayOfWeek: true });
  const counterPartyAddress = readValue(cleanedContractNegotiation, "counterPartyAddress");
  const counterPartyId = readValue(cleanedContractNegotiation, "counterPartyId");
  const protocol = readValue(cleanedContractNegotiation, "protocol");
  const type = readValue(cleanedContractNegotiation, "type");

  return (
    <ul>
      <li className="mt-2">
        <span className="font-bold"><T
          string="contractNegotiations.[id].fieldId" /></span>: {contractNegotiation.id}
      </li>
      <li className="mt-2">
        <span className="font-bold"><T
          string="contractNegotiations.[id].fieldContractAgreementId" /></span>: {contractNegotiation.contractAgreementId}
      </li>
      <li className="mt-2">
        <span className="font-bold"><T
          string="contractNegotiations.[id].fieldCounterPartyAddress" /></span>: {counterPartyAddress}
      </li>
      <li className="mt-2">
        <span className="font-bold"><T
          string="contractNegotiations.[id].fieldCreatedAt" /></span>: {createdAt}
      </li>
      <li className="mt-2">
        <span className="font-bold"><T
          string="contractNegotiations.[id].fieldCounterPartyId" /></span>: <span data-testid="counterparty-id">{counterPartyId}</span>
      </li>
      <li className="mt-2">
        <span className="font-bold"><T
          string="contractNegotiations.[id].fieldProtocol" /></span>: {protocol}
      </li>
      <li className="mt-2">
        <span className="font-bold"><T
          string="contractNegotiations.[id].fieldState" /></span>: {contractNegotiation.state}
      </li>
      <li className="mt-2">
        <span className="font-bold"><T
          string="contractNegotiations.[id].fieldType" /></span>: {type}
      </li>
    </ul>
  );
}
