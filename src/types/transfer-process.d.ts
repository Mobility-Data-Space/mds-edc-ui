declare module "@think-it-labs/edc-connector-client/dist/src/entities/transfer-process" {
    interface TransferProcessInput {
        counterPartyAddress: string;
        contractId: string;
        transferType: string;
        id?: string;
        privateProperties?: Record<string, string>;
    }
}
