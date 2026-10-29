// A data flow as the DFRS views consume it. Mirrors the fields the connector's
// JsonObjectFromDataFlowTransformer emits; `source`/`destination` are kept as raw
// expanded JSON-LD for the details dialog, while the resolved data address is
// fetched separately from /v4/dataflows/{id}/dataaddress.
export type DataFlowDirection = "PULL" | "PUSH" | "UNKNOWN";

export interface DataFlow {
  id: string;
  state: string;
  stateTimestamp?: number;
  createdAt?: number;
  updatedAt?: number;
  assetId?: string;
  agreementId?: string;
  /** The counterparty participant id. */
  participantId?: string;
  transferType?: string;
  direction: DataFlowDirection;
  runtimeId?: string;
  errorDetail?: string;
  /** Raw expanded JSON-LD node, shown verbatim in the details dialog. */
  raw: unknown;
}
