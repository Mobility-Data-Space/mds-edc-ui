import { DataAddress } from "@think-it-labs/edc-connector-client/dist/src/entities/data-address";

declare module "@think-it-labs/edc-connector-client/dist/src/entities/transfer-process" {
    interface TransferProcessInput {
        counterPartyAddress: string;
        contractId: string;
        dataDestination?: DataAddress;
        transferType: string;
        id?: string;
        privateProperties?: Record<string, string>;
    }
}
