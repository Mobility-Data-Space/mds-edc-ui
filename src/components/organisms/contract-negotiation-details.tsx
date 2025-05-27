import React, {useState} from "react";
import { T } from "@/i18n";
import {ContractNegotiation} from "@think-it-labs/edc-connector-client";

interface ContractNegotiationDetailsProps {
  contractNegotiation: ContractNegotiation;
  index?: number;
}
export default function ContractNegotiationDetails({ contractNegotiation, index }: ContractNegotiationDetailsProps) {

  return (
    <ul>
      <li className="mt-2">
        <span className="font-bold"><T
          string="contractNegotiations.[id].fieldId"/></span>: {contractNegotiation.id}
      </li>
      <li className="mt-2">
        <span className="font-bold"><T
          string="contractNegotiations.[id].fieldContractAgreementId"/></span>: {contractNegotiation.contractAgreementId}
      </li>
      <li className="mt-2">
        <span className="font-bold"><T
          string="contractNegotiations.[id].fieldCounterPartyAddress"/></span>: {contractNegotiation.counterPartyAddress}
      </li>
      <li className="mt-2">
        <span className="font-bold"><T
          string="contractNegotiations.[id].fieldCreatedAt"/></span>: {contractNegotiation.createdAt}
      </li>
      <li className="mt-2">
        <span className="font-bold"><T
          string="contractNegotiations.[id].fieldCounterPartyId"/></span>: {contractNegotiation.counterPartyId}
      </li>
      <li className="mt-2">
        <span className="font-bold"><T
          string="contractNegotiations.[id].fieldProtocol"/></span>: {contractNegotiation.protocol}
      </li>
      <li className="mt-2">
        <span className="font-bold"><T
          string="contractNegotiations.[id].fieldState"/></span>: {contractNegotiation.state}
      </li>
      <li className="mt-2">
        <span className="font-bold"><T
          string="contractNegotiations.[id].fieldType"/></span>: {contractNegotiation.type}
      </li>
    </ul>
  );
}
