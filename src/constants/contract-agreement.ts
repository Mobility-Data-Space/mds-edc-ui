import { CONTEXT_EDC } from "@/jsonld/context";

export const TERMINATION_REASON_BY_USER = "Terminated by user";
export const TERMINATION_DETAILED_REASON_MAX_LENGTH = 1000;

export const CONTRACT_AGREEMENT_EDC_NAMESPACE_KEYS = {
  IS_TERMINATED: `${CONTEXT_EDC.value}isTerminated`,
  IS_RUNNING: `${CONTEXT_EDC.value}isRunning`,
  TRANSFER_COUNT: `${CONTEXT_EDC.value}transferCount`,
  IS_TERMINATED_AT: `${CONTEXT_EDC.value}isTerminatedAt`,
  TERMINATION_REASON: `${CONTEXT_EDC.value}terminationReason`,
  ASSET_TITLE: `${CONTEXT_EDC.value}assetTitle`,
} as const;
