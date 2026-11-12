export type NegotiationCounterparty = {
  counterPartyId: string;
  counterPartyAddress: string;
};

/**
 * Reads the counterparty of the negotiation that produced `agreementId`.
 *
 * Reads the connector's **compacted** JSON directly instead of going through
 * the client's `getNegotiation`: in the browser the client's JSON-LD expansion
 * of a v4 `ContractNegotiation` (whose type-scoped context `@import`s the DSP
 * ODRL profile) silently drops `counterPartyId`/`counterPartyAddress`.
 */
export async function fetchNegotiationCounterparty(
  managementUrl: string,
  agreementId: string,
): Promise<NegotiationCounterparty> {
  const response = await fetch(
    `${managementUrl}/v4/contractagreements/${encodeURIComponent(agreementId)}/negotiation`,
  );
  if (!response.ok) {
    throw new Error(
      `Failed to fetch negotiation for agreement ${agreementId}: ${response.status}`,
    );
  }
  const negotiation = await response.json();
  return {
    counterPartyId: negotiation.counterPartyId ?? "",
    counterPartyAddress: negotiation.counterPartyAddress ?? "",
  };
}
