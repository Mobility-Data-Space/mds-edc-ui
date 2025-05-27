/*
import {
  Dataset,
  EdcConnectorClient,
  IdResponse,
  Offer,
  PolicyBuilder,
} from "@think-it-labs/edc-connector-client";
import { randomUUID } from "node:crypto";
import { DATASPACE } from "./constants/dataspace";
import { waitForNegotiationState } from "./seed-util";

const SEED = parseInt(process.env.SEED || "25");

function randomNumber(max: number): number {
  return Math.max(Math.round(Math.random() * max), 1);
}

async function main() {
  // Seed owned connector
  await Promise.all(
    USE_CASES.reduce<Promise<void>[]>((promises, useCase) => {
      promises.push(
        ...Object.entries(useCase.environments).map(
          async ([environment, connector]) => {
            console.log(
              "Prepare connector",
              useCase.id,
              environment,
              connector.id,
            );
            await Promise.all(
              DATASPACE.map(
                useCase.id,
                environment,
                async (participant) => {
                  const client: EdcConnectorClient = new EdcConnectorClient
                    .Builder()
                    .managementUrl(participant.managementUrl)
                    .build();

                  // Create assets
                  console.log(
                    "Create assets for",
                    useCase.id,
                    environment,
                    participant.id,
                  );
                  const assetCount = randomNumber(SEED);
                  const assetPromises: Promise<IdResponse>[] = [];
                  for (let i = 0; i < assetCount; i++) {
                    assetPromises.push(
                      client.management.assets.create({
                        "@id": randomUUID(),
                        properties: {
                          name: `${participant.name} - Asset ${i + 1}`,
                          contenttype: "application/json",
                        },
                        dataAddress: {
                          type: "HttpData",
                          baseUrl: "https://jsonplaceholder.typicode.com/users",
                        },
                        privateProperties: {
                          notes: "Some safe notes",
                        },
                      }),
                    );
                  }
                  console.log(
                    "  awaiting creation assets for",
                    useCase.id,
                    environment,
                    participant.id,
                  );
                  const assets = await Promise.all(assetPromises);
                  console.log(
                    "  assets created",
                    assets.length,
                    useCase.id,
                    environment,
                    participant.id,
                  );

                  // Create policy definitions
                  console.log(
                    "Create policy definitions for",
                    useCase.id,
                    environment,
                    participant.id,
                  );
                  const policyDefinitionCount = randomNumber(assetCount);
                  const policyDefinitionPromises: Promise<IdResponse>[] = [];
                  for (let i = 0; i < policyDefinitionCount; i++) {
                    policyDefinitionPromises.push(
                      client.management.policyDefinitions.create({
                        "@id": randomUUID(),
                        policy: new PolicyBuilder()
                          .type("Set")
                          .build(),
                      }),
                    );
                  }
                  console.log(
                    "  awaiting creation policy definitions for",
                    useCase.id,
                    environment,
                    participant.id,
                  );
                  const policyDefinitions = await Promise.all(
                    policyDefinitionPromises,
                  );
                  console.log(
                    "  policy definitions created",
                    useCase.id,
                    environment,
                    participant.id,
                  );

                  // Create contract definitions
                  console.log(
                    "Create contract definitions for",
                    useCase.id,
                    environment,
                    participant.id,
                  );
                  const contractDefinitionCount = randomNumber(
                    policyDefinitionCount,
                  );
                  const contractDefinitionPromises: Promise<IdResponse>[] = [];
                  for (let i = 0; i < contractDefinitionCount; i++) {
                    let policyDefinitionId: string | undefined = undefined;
                    while (!policyDefinitionId) {
                      policyDefinitionId = policyDefinitions[
                        randomNumber(policyDefinitions.length) - 1
                      ]?.id;
                    }
                    console.log(
                      "Got policy definition ID",
                      policyDefinitionId,
                    );
                    contractDefinitionPromises.push(
                      client.management.contractDefinitions.create({
                        "@id": randomUUID(),
                        accessPolicyId: policyDefinitionId,
                        contractPolicyId: policyDefinitionId,
                        assetsSelector: [],
                      }),
                    );
                  }
                  console.log(
                    "  awaiting creation contract definitions for",
                    useCase.id,
                    environment,
                    participant.id,
                  );
                  await Promise.all(
                    contractDefinitionPromises,
                  );
                  console.log(
                    "  contract definitions created",
                    useCase.id,
                    environment,
                    participant.id,
                  );
                },
              ),
            );

            console.log("===============================");
            console.log("===============================");
            console.log("===============================");

            const client: EdcConnectorClient = new EdcConnectorClient
              .Builder()
              .managementUrl(connector.managementUrl)
              .build();

            // Create assets
            console.log(
              "Create assets for",
              useCase.id,
              environment,
              connector.id,
            );
            const assetCount = randomNumber(SEED);
            const assetPromises: Promise<IdResponse>[] = [];
            for (let i = 0; i < assetCount; i++) {
              assetPromises.push(
                client.management.assets.create({
                  "@id": randomUUID(),
                  properties: {
                    name: `${connector.name} - Asset ${i + 1}`,
                    contenttype: "application/json",
                  },
                  dataAddress: {
                    type: "HttpData",
                    baseUrl: "https://jsonplaceholder.typicode.com/users",
                  },
                  privateProperties: {
                    notes: "Some safe notes",
                  },
                }),
              );
            }
            console.log(
              "  awaiting creation assets for",
              useCase.id,
              environment,
              connector.id,
            );
            const assets = await Promise.all(assetPromises);
            console.log(
              "  assets created",
              assets.length,
              useCase.id,
              environment,
              connector.id,
            );

            // Create policy definitions
            console.log(
              "Create policy definitions for",
              useCase.id,
              environment,
              connector.id,
            );
            const policyDefinitionCount = randomNumber(assetCount);
            const policyDefinitionPromises: Promise<IdResponse>[] = [];
            for (let i = 0; i < policyDefinitionCount; i++) {
              policyDefinitionPromises.push(
                client.management.policyDefinitions.create({
                  "@id": randomUUID(),
                  policy: new PolicyBuilder()
                    .type("Set")
                    .build(),
                }),
              );
            }
            console.log(
              "  awaiting creation policy definitions for",
              useCase.id,
              environment,
              connector.id,
            );
            const policyDefinitions = await Promise.all(
              policyDefinitionPromises,
            );
            console.log(
              "  policy definitions created",
              policyDefinitions.length,
              useCase.id,
              environment,
              connector.id,
            );

            // Create contract definitions
            console.log(
              "Create contract definitions for",
              useCase.id,
              environment,
              connector.id,
            );
            const contractDefinitionCount = randomNumber(policyDefinitionCount);
            const contractDefinitionPromises: Promise<IdResponse>[] = [];
            for (let i = 0; i < contractDefinitionCount; i++) {
              let policyDefinitionId: string | undefined = undefined;
              while (!policyDefinitionId) {
                policyDefinitionId =
                  policyDefinitions[randomNumber(policyDefinitions.length) - 1]
                    ?.id;
              }
              contractDefinitionPromises.push(
                client.management.contractDefinitions.create({
                  "@id": randomUUID(),
                  accessPolicyId: policyDefinitionId,
                  contractPolicyId: policyDefinitionId,
                  assetsSelector: [],
                }),
              );
            }
            console.log(
              "  awaiting creation contract definitions for",
              useCase.id,
              environment,
              connector.id,
            );
            const contractDefinition = await Promise.all(
              contractDefinitionPromises,
            );
            console.log(
              "  contract definitions created",
              contractDefinition.length,
              useCase.id,
              environment,
              connector.id,
            );

            console.log("===============================");
            console.log("===============================");
            console.log("===============================");

            // Negotiate and transfer
            await Promise.all(
              DATASPACE.map(
                useCase.id,
                environment,
                async (participant) => {
                  console.log(
                    "Negotiate and transfer",
                    useCase.id,
                    environment,
                    connector.id,
                    participant.id,
                  );
                  // Create contracts negotiations and agreements
                  const asConsumerValidNegotiations: [Dataset, IdResponse][] =
                    [];
                  const asProviderValidNegotiations: [Dataset, IdResponse][] =
                    [];

                  await Promise.all([
                    (async () => {
                      const client: EdcConnectorClient = new EdcConnectorClient
                        .Builder()
                        .managementUrl(connector.managementUrl)
                        .build();
                      console.log(
                        "Get offers",
                        useCase.id,
                        environment,
                        connector.id,
                        participant.id,
                      );
                      const contractCount = randomNumber(SEED);
                      // get offers
                      const catalog = await client.management.catalog.request(
                        {
                          counterPartyAddress: participant.protocolUrl,
                        },
                      );
                      for (let i = 0; i < contractCount; i++) {
                        // create contract
                        console.log(
                          "  extract dataset",
                          useCase.id,
                          environment,
                          connector.id,
                          participant.id,
                        );
                        let dataset: Dataset | undefined = undefined;
                        let offer: Offer | undefined = undefined;
                        while (!dataset && !offer) {
                          dataset = catalog
                            .datasets[
                              randomNumber(catalog.datasets.length) - 1
                            ];
                          offer = dataset?.offers[0];
                        }
                        console.log(
                          "  dataset and offer found",
                          useCase.id,
                          environment,
                          connector.id,
                          participant.id,
                          dataset?.id,
                          offer?.id,
                        );

                        const contractOffer = new PolicyBuilder()
                          .raw({
                            ...offer,
                            assigner: "provider",
                            target: dataset?.id,
                          })
                          .build();

                        // Initiate contract negotiation on the consumer's side
                        console.log(
                          "  initiate negotiaton",
                          useCase.id,
                          environment,
                          connector.id,
                          participant.id,
                          dataset?.id,
                          offer?.id,
                        );
                        const idResponse = await client.management
                          .contractNegotiations.initiate(
                            {
                              counterPartyAddress: participant.protocolUrl,
                              policy: contractOffer,
                            },
                          );

                        // 1/10 terminate contract
                        if (randomNumber(10) === 0) {
                          console.log(
                            "  terminate negotiation",
                            useCase.id,
                            environment,
                            connector.id,
                            participant.id,
                            dataset?.id,
                            offer?.id,
                            idResponse.id,
                          );
                          await client.management.contractNegotiations
                            .terminate(
                              idResponse.id,
                              "for a good reason",
                            );

                          continue;
                        }

                        asConsumerValidNegotiations.push([
                          dataset as Dataset,
                          idResponse,
                        ]);
                      }
                    })(),
                    (async () => {
                      const client: EdcConnectorClient = new EdcConnectorClient
                        .Builder()
                        .managementUrl(participant.managementUrl)
                        .build();
                      console.log(
                        "Get offers",
                        useCase.id,
                        environment,
                        connector.id,
                        participant.id,
                      );
                      const contractCount = randomNumber(SEED);
                      // get offers
                      const catalog = await client.management.catalog.request(
                        {
                          counterPartyAddress: connector.protocolUrl,
                        },
                      );
                      for (let i = 0; i < contractCount; i++) {
                        // create contract
                        console.log(
                          "  extract dataset",
                          useCase.id,
                          environment,
                          connector.id,
                          participant.id,
                        );
                        let dataset: Dataset | undefined = undefined;
                        let offer: Offer | undefined = undefined;
                        while (!dataset && !offer) {
                          dataset = catalog
                            .datasets[
                              randomNumber(catalog.datasets.length) - 1
                            ];
                          offer = dataset?.offers[0];
                        }

                        console.log(
                          "  dataset and offer found",
                          useCase.id,
                          environment,
                          connector.id,
                          participant.id,
                          dataset?.id,
                          offer?.id,
                        );
                        const contractOffer = new PolicyBuilder()
                          .raw({
                            ...offer,
                            assigner: "provider",
                            target: dataset?.id,
                          })
                          .build();

                        // Initiate contract negotiation on the consumer's side
                        console.log(
                          "  initiate negotiaton",
                          useCase.id,
                          environment,
                          connector.id,
                          participant.id,
                          dataset?.id,
                          offer?.id,
                        );
                        const idResponse = await client.management
                          .contractNegotiations.initiate(
                            {
                              counterPartyAddress: connector.protocolUrl,
                              policy: contractOffer,
                            },
                          );

                        // 1/10 terminate contract
                        if (randomNumber(10) === 0) {
                          console.log(
                            "  terminate negotiation",
                            useCase.id,
                            environment,
                            connector.id,
                            participant.id,
                            dataset?.id,
                            offer?.id,
                            idResponse.id,
                          );
                          await client.management.contractNegotiations
                            .terminate(
                              idResponse.id,
                              "for a good reason",
                            );

                          continue;
                        }

                        asProviderValidNegotiations.push([
                          dataset as Dataset,
                          idResponse,
                        ]);
                      }
                    })(),
                  ]);

                  // Transfer processes
                  await Promise.all([
                    (async () => {
                      // TYPE: EdcConnectorClient
                      const client =
                        new EdcConnectorClient
                          .Builder()
                          .managementUrl(connector.managementUrl)
                          .build();
                      const transferCount = randomNumber(SEED);
                      for (let i = 0; i < transferCount; i++) {
                        // create transfer
                        const [dataset, negotiation] =
                          asConsumerValidNegotiations[
                            randomNumber(asConsumerValidNegotiations.length)
                          ];

                        await waitForNegotiationState(
                          client,
                          negotiation.id,
                          "FINALIZED",
                        );

                        const contractNegotiation = await client.management
                          .contractNegotiations
                          .get(
                            negotiation.id,
                          );

                        const contractAgreement = await client.management
                          .contractAgreements.get(
                            contractNegotiation.contractAgreementId,
                          );

                        const idResponse = await client.management
                          .transferProcesses.initiate(
                            {
                              assetId: dataset.id,
                              counterPartyAddress: participant.protocolUrl,
                              contractId: contractAgreement.id,
                              transferType: "HttpData-PULL",
                              dataDestination: { type: "HttpProxy" },
                            },
                          );

                        // 1/10 terminate transfer
                        if (randomNumber(10) === 0) {
                          await client.management.transferProcesses.terminate(
                            idResponse.id,
                            "for a good reason",
                          );

                          if (randomNumber(20) === 0) {
                            await client.management.transferProcesses
                              .deprovision(
                                idResponse.id,
                              );
                          }
                        }

                        // 1/10 terminate contract
                        if (randomNumber(10) === 0) {
                          await client.management.contractNegotiations
                            .terminate(
                              negotiation.id,
                              "for a good reason",
                            );
                        }
                      }
                    })(),
                    (async () => {
                      // create transfer
                      const [dataset, negotiation] =
                        asConsumerValidNegotiations[
                          randomNumber(asConsumerValidNegotiations.length)
                        ];

                      await waitForNegotiationState(
                        client,
                        negotiation.id,
                        "FINALIZED",
                      );

                      const contractNegotiation = await client.management
                        .contractNegotiations
                        .get(
                          negotiation.id,
                        );

                      const contractAgreement = await client.management
                        .contractAgreements.get(
                          contractNegotiation.contractAgreementId,
                        );

                      const idResponse = await client.management
                        .transferProcesses.initiate(
                          {
                            assetId: dataset.id,
                            counterPartyAddress: connector.protocolUrl,
                            contractId: contractAgreement.id,
                            transferType: "HttpData-PULL",
                            dataDestination: { type: "HttpProxy" },
                          },
                        );

                      // 1/10 terminate transfer
                      if (randomNumber(10) === 0) {
                        await client.management.transferProcesses.terminate(
                          idResponse.id,
                          "for a good reason",
                        );

                        if (randomNumber(20) === 0) {
                          await client.management.transferProcesses
                            .deprovision(
                              idResponse.id,
                            );
                        }
                      }

                      // 1/10 terminate contract
                      if (randomNumber(10) === 0) {
                        await client.management.contractNegotiations
                          .terminate(
                            negotiation.id,
                            "for a good reason",
                          );
                      }
                    })(),
                  ]);
                },
              ),
            );
          },
        ),
      );

      return promises;
    }, []),
  );
}

main()
  .then(() => console.log("DONE"))
  .catch(console.error);

*/
