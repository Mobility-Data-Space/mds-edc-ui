import type {
  DataAddress,
  TransferProcessInput,
} from "@think-it-labs/edc-connector-client";

// edc-connector-client 0.11.0 has no `dataDestination` on `TransferProcessInput`,
// but the MDS connector's v4 `TransferRequest` still takes it for PUSH transfers.
// The client spreads the input into the request body, so the field is sent as-is.
// The address needs its own `@type: "DataAddress"`: the v4 context maps
// `dataDestination` without a nested context, so `type` is only recognised
// inside a typed `DataAddress` node.
export type MdsTransferProcessInput = TransferProcessInput & {
  dataDestination?: DataAddress & { "@type": "DataAddress" };
};
