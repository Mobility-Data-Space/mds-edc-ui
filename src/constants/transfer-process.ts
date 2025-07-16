import {TransferProcessStates} from "@think-it-labs/edc-connector-client";

export const STATE_RUNNING = "RUNNING";
export const STATE_ERROR = "ERROR";
export const STATE_FINALIZED = "FINALIZED";

export const COLORS: { [key: string]: string } = {
  [STATE_RUNNING]: "#7eb0d5",
  [TransferProcessStates.STARTED]: "#7eb0d5",
  [TransferProcessStates.DEPROVISIONED]: "#B91C1C",
  [STATE_ERROR]: "#B91C1C",
  [TransferProcessStates.TERMINATED]: "#96D200",
  [STATE_FINALIZED]: "#96D200",
};

export const HOVER_COLORS: { [key: string]: string } = {
  [STATE_RUNNING]: "#719ec0",
  [TransferProcessStates.STARTED]: "#719ec0",
  [TransferProcessStates.DEPROVISIONED]: "#A11818",
  [STATE_ERROR]: "#A11818",
  [TransferProcessStates.TERMINATED]: "#87BD00",
  [STATE_FINALIZED]: "#87BD00",
};
