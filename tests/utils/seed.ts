import { Participant } from "@/constants/dataspace";
import { EdcConnectorClient, IdResponse } from "@think-it-labs/edc-connector-client";
import { randomUUID } from "node:crypto";

function randomNumber(max: number): number {
  return Math.max(Math.round(Math.random() * max), 1);
}

const SEED = parseInt(process.env.SEED || "10");
    
export async function seed(participant: Participant) {
    const client: EdcConnectorClient = new EdcConnectorClient
        .Builder()
        .managementUrl(participant.connectorManagementUrl)
        .apiToken(process.env.TEST_API_KEY || "default-test-api-key")
        .build();

    // Create assets
    const assetCount = randomNumber(SEED);
    const assetPromises: Promise<IdResponse>[] = [];

    console.log(
        "Create assets for",
        participant.id,
    );
    for (let i = 0; i < assetCount; i++) {
        assetPromises.push(
            client.management.assets.create({
                "@id": `asset-${i + 1}-id`,
                properties: {
                    "http://purl.org/dc/terms/title": `${participant.name} - Asset ${i + 1}`,
                    "https://w3id.org/mobilitydcat-ap/mobilityTheme": {
                        "https://w3id.org/mobilitydcat-ap/mobility-theme/data-content-category": "INFRASTRUCTURE_AND_LOGISTICS",
                        "https://w3id.org/mobilitydcat-ap/mobility-theme/data-content-sub-category": "GENERAL_INFORMATION_ABOUT_PLANNING_OF_ROUTES"
                    },
                    "https://w3id.org/mobilitydcat-ap/mobilityDataStandard": {
                        "@id": "my-data-model-001",
                        "https://w3id.org/mobilitydcat-ap/schema": {
                            "http://www.w3.org/ns/dcat#downloadURL": [
                                "https://teamabc.departmentxyz.schema/a",
                                "https://teamabc.departmentxyz.schema/b"
                            ],
                            "http://www.w3.org/2000/01/rdf-schema#Literal": "These reference files are important"
                        }
                    },  
                    "https://w3id.org/mobilitydcat-ap/transportMode": "RAIL",
                    "https://w3id.org/mobilitydcat-ap/georeferencingMethod": "my-geo-reference-method",
                    "http://purl.org/dc/terms/description": `Description for Asset ${i + 1}`,
                    "http://purl.org/dc/terms/language": "code/EN",
                    "http://purl.org/dc/terms/publisher": "https://data-source.my-org/about",
                    "http://purl.org/dc/terms/license": "https://data-source.my-org/license",
                    "http://purl.org/dc/terms/rightsHolder": "Think-it GmbH",
                    "http://purl.org/dc/terms/accessRights": "usage policies and rights",
                    "http://purl.org/dc/terms/spatial": {
                        "http://www.w3.org/2004/02/skos/core#prefLabel": "my-geo-location",
                        "http://purl.org/dc/terms/identifier": ["DE769", "DE636"]
                    },
                    "http://purl.org/dc/terms/isReferencedBy": "https://data-source.my-org/references",
                    "http://purl.org/dc/terms/temporal": {
                        "http://www.w3.org/ns/dcat#startDate": "2024-02-01",
                        "http://www.w3.org/ns/dcat#endDate": "2027-02-01"
                    },
                    "http://purl.org/dc/terms/accrualPeriodicity": "every month",
                    "http://www.w3.org/ns/dcat#organization": "Think-it GmbH",
                    "http://www.w3.org/ns/dcat#keywords": ["keyword1", "keyword2"],
                    "http://www.w3.org/ns/dcat#mediaType": "application/json",
                    "http://www.w3.org/ns/dcat#landingPage": "https://data-source.my-org/docs",
                    "http://www.w3.org/2002/07/owl#versionInfo": "1.1",
                    "http://www.w3.org/ns/adms#sample": ["https://teamabc.departmentxyz.sample/a", "https://teamabc.departmentxyz.sample/b"]
                },
                dataAddress: {
                    type: "HttpData",
                    baseUrl: "https://jsonplaceholder.typicode.com/users",
                },
                privateProperties: {
                    notes: "Some safe notes",
                }
        }),
    )}
    
    console.log(
        "  awaiting creation assets for",
        participant.id,
    );
    await Promise.all(assetPromises);
    console.log(
        "  assets created",
        participant.id,
    );

    console.log(
        "Create contract definitions for",
        participant.id,
    );
    const contractDefinitionPromises: Promise<IdResponse>[] = [];
    const policyDefinitionId = "always-true";
    contractDefinitionPromises.push(
        client.management.contractDefinitions.create({
            "@id": randomUUID(),
            accessPolicyId: policyDefinitionId,
            contractPolicyId: policyDefinitionId,
            assetsSelector: [],
        }),
    )
    console.log(
        "  awaiting creation contract definitions for",
        participant.id,
    );
    await Promise.all(contractDefinitionPromises);
    console.log(
        "  contract definitions created",
        participant.id,
    );
}
