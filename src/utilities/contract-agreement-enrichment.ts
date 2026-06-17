import { CONTRACT_AGREEMENT_EDC_NAMESPACE_KEYS } from "@/constants/contract-agreement";
import { STATE_RUNNING } from "@/constants/transfer-process";
import { ASSET_TITLE } from "@/jsonld/asset";
import { EnrichedContractAgreement } from "@/types/enriched-contract-agreement";
import { cache, CacheValue } from "@/utilities/cache";
import { counterPartyAddressWithDsp2025_1 } from "@/utilities/catalog";
import { getConnectorConfig } from "@/utilities/connector-config";
import { RetiredContractAgreement } from "@/utilities/contract-agreement";
import { operatorIn } from "@/utilities/data-offer";
import { getEdcClient } from "@/utilities/edc-client";
import {
  Asset,
  Catalog,
  ContractAgreement,
  CriterionInput,
  expand,
  QuerySpec,
  TransferProcessStates,
} from "@think-it-labs/edc-connector-client";

const extractStatusFilter = (body: QuerySpec): CriterionInput | null => {
  const statusFilterIndex = body.filterExpression?.findIndex(
    (filterExpression) => filterExpression.operandLeft === "isTerminated",
  );

  if (statusFilterIndex !== undefined && statusFilterIndex !== -1) {
    return body.filterExpression?.splice(statusFilterIndex, 1)[0]!;
  }

  return null;
};

const fetchRetiredAgreementsMap = async (
  client: ReturnType<typeof getEdcClient>,
): Promise<Map<string, RetiredContractAgreement>> => {
  const retiredAgreements = await client.retirement.request();

  return new Map(
    retiredAgreements.map(
      (retiredAgreement) =>
        [retiredAgreement.agreementId, retiredAgreement] as const,
    ),
  );
};

const buildContractAgreementInfoMap = (
  transferProcesses: Awaited<
    ReturnType<
      ReturnType<
        typeof getEdcClient
      >["management"]["transferProcesses"]["queryAll"]
    >
  >,
  retiredAgreementMap: Map<string, RetiredContractAgreement>,
): Record<string, ContractAgreementInfo> => {
  const infoMap = transferProcesses.reduce((acc, transferProcess) => {
    const contractAgreementId = transferProcess.contractId;
    const existingInfo = acc.get(contractAgreementId);
    const retiredContractAgreement =
      retiredAgreementMap.get(contractAgreementId);

    if (existingInfo) {
      return acc.set(contractAgreementId, {
        ...existingInfo,
        transfersCount: existingInfo.transfersCount + 1,
        isRunning:
          existingInfo.isRunning || transferProcess.state === STATE_RUNNING,
      });
    }

    return acc.set(contractAgreementId, {
      isTerminated: retiredAgreementMap.has(contractAgreementId),
      isRunning:
        transferProcess.state !== TransferProcessStates.TERMINATED &&
        transferProcess.state === STATE_RUNNING,
      isTerminatedAt: retiredContractAgreement?.agreementRetirementDate ?? 0,
      retirementReason: retiredContractAgreement?.reason ?? "",
      transfersCount: 1,
    });
  }, new Map<string, ContractAgreementInfo>());

  return Object.fromEntries(infoMap);
};

const fetchLocalAssetTitles = async (
  client: ReturnType<typeof getEdcClient>,
  contractAgreements: ContractAgreement[],
): Promise<Map<string, string>> => {
  if (!contractAgreements.length) {
    return new Map();
  }

  const assets: Asset[] = await client.management.assets.queryAll({
    limit: 100,
    offset: 0,
    filterExpression: [
      {
        operandLeft: "id",
        operator: "in",
        operandRight: contractAgreements.map(
          (contractAgreement) => contractAgreement.assetId,
        ),
      },
    ],
  });

  return new Map(
    assets.map((asset) => [
      asset.id,
      asset.properties[ASSET_TITLE][0]["@value"],
    ]),
  );
};

const fetchForeignAssetTitles = async (
  client: ReturnType<typeof getEdcClient>,
  configId: string,
  contractAgreements: ContractAgreement[],
): Promise<Map<string, string | undefined>> => {
  const foreignContracts = contractAgreements.filter(
    (ca) => ca.providerId !== configId,
  );
  const connectorContractsMap = Map.groupBy(
    foreignContracts,
    (ca) => ca.providerId,
  );

  // fetch each provider's catalog independently; a provider that is
  // offline (e.g. outside its business hours) only loses its titles
  const results = await Promise.allSettled(
    Array.from(connectorContractsMap, async ([connectorId, cas]) => {
      const dsp: CacheValue = await cache.get(connectorId, async () => {
        const negotiation =
          await client.management.contractAgreements.getNegotiation(cas[0].id);
        return {
          id: negotiation.optionalValue("edc", "counterPartyId") as string,
          address: negotiation.optionalValue(
            "edc",
            "counterPartyAddress",
          ) as string,
        };
      });

      const catalog = await client.management.catalog.request({
        counterPartyId: dsp.id,
        counterPartyAddress: counterPartyAddressWithDsp2025_1(dsp.address),
        querySpec: {
          limit: 1000,
          offset: 0,
          filterExpression: [
            {
              operandLeft: "id",
              operator: "in",
              operandRight: cas.map((ca) => ca.assetId),
            },
          ],
        },
      });

      return [connectorId, catalog] as [string, Catalog];
    }),
  );

  return new Map(
    results.flatMap((result) => {
      if (result.status === "rejected") {
        console.warn(
          "Skipping unreachable provider:",
          result.reason instanceof Error ? result.reason.message : result.reason,
        );
        return [];
      }
      const [connectorId, catalog] = result.value;
      return catalog.datasets.map((dataset) => {
        return [
          `${connectorId}-${dataset.id}`,
          dataset["http://purl.org/dc/terms/title"]?.[0]?.["@value"] as
          | string
          | undefined,
        ];
      });
    }),
  );
};

const enrichContractAgreement = (
  contractAgreement: ContractAgreement,
  retiredContractAgreementMap: Map<string, RetiredContractAgreement>,
  contractAgreementInfo: Record<string, ContractAgreementInfo>,
  assetTitleMap: Map<string, string>,
) => {
  return expand(
    {
      ...contractAgreement,
      [CONTRACT_AGREEMENT_EDC_NAMESPACE_KEYS.IS_TERMINATED]:
        retiredContractAgreementMap.has(contractAgreement.id) || false,
      [CONTRACT_AGREEMENT_EDC_NAMESPACE_KEYS.IS_RUNNING]:
        contractAgreementInfo[contractAgreement.id]?.isRunning || false,
      [CONTRACT_AGREEMENT_EDC_NAMESPACE_KEYS.TRANSFER_COUNT]:
        contractAgreementInfo[contractAgreement.id]?.transfersCount || 0,
      [CONTRACT_AGREEMENT_EDC_NAMESPACE_KEYS.IS_TERMINATED_AT]:
        contractAgreementInfo[contractAgreement.id]?.isTerminatedAt ||
        retiredContractAgreementMap.get(contractAgreement.id)
          ?.agreementRetirementDate ||
        0,
      [CONTRACT_AGREEMENT_EDC_NAMESPACE_KEYS.TERMINATION_REASON]:
        contractAgreementInfo[contractAgreement.id]?.retirementReason ||
        retiredContractAgreementMap.get(contractAgreement.id)?.reason ||
        "",
      [CONTRACT_AGREEMENT_EDC_NAMESPACE_KEYS.ASSET_TITLE]:
        assetTitleMap.get(contractAgreement.assetId) || null,
    },
    () => new EnrichedContractAgreement(),
  );
};

const shouldIncludeAgreement = (
  contractAgreement: EnrichedContractAgreement,
  statusFilter: CriterionInput | null,
) => {
  //NOTE: this is inefficient and should be replaced when this is closed https://github.com/eclipse-edc/Connector/issues/5132
  if (statusFilter && !statusFilter.operandRight) {
    return !contractAgreement.isTerminated;
  }
  return true;
};

export async function queryEnrichedContractAgreements(
  body: QuerySpec,
): Promise<EnrichedContractAgreement[]> {
  const config = getConnectorConfig();
  const client = getEdcClient();

  const statusFilter = extractStatusFilter(body);

  // Don't use optional chaining here, statusFilter needs to exist first
  if (statusFilter && statusFilter.operator !== "=") {
    throw new Error(`Operator ${statusFilter.operator} not supported`);
  }

  const retiredAgreementMap = await fetchRetiredAgreementsMap(client);

  // Should fetch only the needed ones
  const transferProcesses = await client.management.transferProcesses.queryAll({
    offset: 0,
    limit: 10000,
  });

  const contractAgreementInfo = buildContractAgreementInfoMap(
    transferProcesses,
    retiredAgreementMap,
  );

  const retiredContractAgreementIds = Array.from(retiredAgreementMap.keys());

  // NOTE: has to specifically be true
  if (statusFilter && statusFilter.operandRight === true) {
    body.filterExpression?.push({
      operandLeft: "id",
      operator: operatorIn.value,
      operandRight: retiredContractAgreementIds.length
        ? retiredContractAgreementIds
        : [""],
    });
  }

  const contractAgreements =
    await client.management.contractAgreements.queryAll(body);

  const assetTitleMap = await fetchLocalAssetTitles(client, contractAgreements);

  const enrichedAgreements = (
    await Promise.all(
      contractAgreements.map((agreement) =>
        enrichContractAgreement(
          agreement,
          retiredAgreementMap,
          contractAgreementInfo,
          assetTitleMap,
        ),
      ),
    )
  ).filter((agreement) => shouldIncludeAgreement(agreement, statusFilter));

  // enrich foreign contracts with asset titles from remote catalogs
  const catalogConnectorMap = await fetchForeignAssetTitles(
    client,
    config.id,
    contractAgreements,
  );

  return enrichedAgreements.map((ca) => {
    if (!ca.assetTitle) {
      ca.setValue(
        "edc",
        "assetTitle",
        catalogConnectorMap.get(`${ca.providerId}-${ca.assetId}`) || null,
      );
    }
    return ca;
  });
}
