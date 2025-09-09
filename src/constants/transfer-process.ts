import { TransferProcessStates } from "@think-it-labs/edc-connector-client";

export const STATE_RUNNING = "RUNNING";
export const STATE_ERROR = "ERROR";
export const STATE_FINALIZED = "FINALIZED";

export const COLORS: { [key: string]: string } = {
  [STATE_RUNNING]: "#FFFF00",
  [TransferProcessStates.STARTED]: "#FFFF00",
  [TransferProcessStates.DEPROVISIONED]: "#6E7378",
  [STATE_ERROR]: "#B91C1C",
  [TransferProcessStates.TERMINATED]: "#000000",
  [STATE_FINALIZED]: "#96D200",
};

export const HOVER_COLORS: { [key: string]: string } = {
  [STATE_RUNNING]: "#E0E000",
  [TransferProcessStates.STARTED]: "#E0E000",
  [TransferProcessStates.DEPROVISIONED]: "#C8CACC",
  [STATE_ERROR]: "#A11818",
  [TransferProcessStates.TERMINATED]: "#000000",
  [STATE_FINALIZED]: "#87BD00",
};
