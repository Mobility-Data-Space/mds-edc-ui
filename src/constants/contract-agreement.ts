export const TERMINATION_REASON_BY_USER = "Terminated by user";
export const TERMINATION_DETAILED_REASON_MAX_LENGTH = 1000;

export const CONTRACT_AGREEMENT_EDC_NAMESPACE_KEYS = {
  IS_TERMINATED: "https://w3id.org/edc/v0.0.1/ns/isTerminated",
  IS_RUNNING: "https://w3id.org/edc/v0.0.1/ns/isRunning",
  TRANSFER_COUNT: "https://w3id.org/edc/v0.0.1/ns/transferCount",
  IS_TERMINATED_AT: "https://w3id.org/edc/v0.0.1/ns/isTerminatedAt",
  RETIREMENT_REASON: "https://w3id.org/edc/v0.0.1/ns/terminatedReason",
  ASSET_TITLE: "https://w3id.org/edc/v0.0.1/ns/assetTitle",
} as const;
