import {
  STATE_ERROR,
  STATE_FINALIZED,
  STATE_RUNNING,
} from "@/constants/transfer-process";
import { TransferProcessStates } from "@think-it-labs/edc-connector-client";

// EDC states in which a transfer is still in progress
const RUNNING_STATES: ReadonlySet<string> = new Set([
  TransferProcessStates.INITIAL,
  TransferProcessStates.PROVISIONING,
  TransferProcessStates.PROVISIONING_REQUESTED,
  TransferProcessStates.PROVISIONED,
  TransferProcessStates.REQUESTING,
  TransferProcessStates.REQUESTED,
  TransferProcessStates.STARTING,
  TransferProcessStates.STARTED,
  TransferProcessStates.SUSPENDING,
  TransferProcessStates.COMPLETING,
]);

const FINALIZED_STATES: ReadonlySet<string> = new Set([
  TransferProcessStates.COMPLETED,
  TransferProcessStates.DEPROVISIONED,
]);

export type UiTransferProcessState =
  | typeof STATE_RUNNING
  | typeof STATE_ERROR
  | typeof STATE_FINALIZED;

// Maps an EDC transfer process state onto the simplified UI state.
// Returns null for states without a UI equivalent (e.g. SUSPENDED).
export const toUiTransferProcessState = (transferProcess: {
  state: string;
  errorDetail?: string;
}): UiTransferProcessState | null => {
  if (RUNNING_STATES.has(transferProcess.state)) {
    return STATE_RUNNING;
  }
  if (
    transferProcess.state === TransferProcessStates.TERMINATED &&
    transferProcess.errorDetail
  ) {
    return STATE_ERROR;
  }
  if (FINALIZED_STATES.has(transferProcess.state)) {
    return STATE_FINALIZED;
  }
  return null;
};

export const isTransferProcessRunning = (transferProcess: {
  state: string;
}): boolean => RUNNING_STATES.has(transferProcess.state);
