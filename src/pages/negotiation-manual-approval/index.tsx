import { Table } from "@/components/atoms/table";
import { renderPagination } from "@/components/molecules/pagination-controls";
import SearchBar from "@/components/molecules/search-bar";
import ContractNegotiationDialog from "@/components/organisms/contract-negotiation-dialog";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { MDSManualApprovalController } from "@/utilities/contract-negotiations";
import { formatDateTime, formatDateTimeAgo } from "@/utilities/date";
import { Button, Icon, Tooltip } from "@mui/material";
import {
  ContractNegotiation,
  CriterionInput,
} from "@think-it-labs/edc-connector-client";
import { ContractNegotiationsList } from "@think-it-labs/edc-connector-ui/contract-negotiations-list";
import { readValue } from "@think-it-labs/edc-connector-ui/json-ld";
import { useRouter } from "next/router";
import { MouseEvent, useMemo, useRef, useState } from "react";
import { ErrorPopup } from "@/components/molecules/error-popup";
import { useAppSnackbar } from "@/hooks/use-app-snackbar";
import { MAX_ITEMS } from "@/constants/lists";
import { useListPage } from "@/hooks/use-list-page";
import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import { ListToolbar } from "@/components/molecules/list-toolbar";

const CreatedAt = ({ item }: { item: ContractNegotiation }) => {
  const createdAtValue = readValue(
    item,
    "https://w3id.org/edc/v0.0.1/ns/createdAt",
  );
  return (
    <Tooltip
      title={formatDateTime(createdAtValue, {
        showSeconds: true,
        showDayOfWeek: true,
      })}
    >
      <span>{formatDateTimeAgo(createdAtValue)}</span>
    </Tooltip>
  );
};

const CounterPartyId = ({ item }: { item: ContractNegotiation }) => {
  const counterPartyId =
    readValue(item, "https://w3id.org/edc/v0.0.1/ns/counterPartyId") ||
    readValue(item, "counterPartyId") ||
    item.counterPartyId;
  return <>{counterPartyId}</>;
};

const AssetName = ({ item }: { item: ContractNegotiation }) => {
  const assetId =
    readValue(item, "https://w3id.org/edc/v0.0.1/ns/assetId") ||
    readValue(item, "assetId") ||
    item.assetId;
  return <>{assetId}</>;
};

const PENDING_FILTER: CriterionInput[] = [
  {
    operandLeft: "pending",
    operator: "=",
    operandRight: true,
  },
];

const NegotiationId = ({ item }: { item: ContractNegotiation }) => {
  return <>{item["@id"]}</>;
};

export default function ContractNegotiationsManualApprovalListPage() {
  const { push } = useRouter();
  const { connector } = useParticipantConnectorState();
  const { translator } = useTranslator();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { showSnackbar } = useAppSnackbar();

  const [openContractNegotiationData, setOpenContractNegotiationData] =
    useState({
      contractNegotiation: {} as ContractNegotiation,
    });

  const mdsManualApprovalController = useMemo(
    () => new MDSManualApprovalController(proxyConnectorManagement),
    [],
  );

  const openDetailsModal = (contractNegotiation: ContractNegotiation) => {
    setIsDetailsModalOpen(true);
    setOpenContractNegotiationData({ contractNegotiation });
  };

  // the ref guards against double clicks before the next render
  const submittingIdsRef = useRef(new Set<string>());
  const [submittingIds, setSubmittingIds] = useState<ReadonlySet<string>>(
    new Set(),
  );

  const submitDecision = (
    decision: "approve" | "reject",
    item: ContractNegotiation,
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();

    const id = item["@id"];
    if (submittingIdsRef.current.has(id)) {
      return;
    }
    submittingIdsRef.current.add(id);
    setSubmittingIds(new Set(submittingIdsRef.current));

    mdsManualApprovalController[decision](id)
      .then(() => {
        showSnackbar({
          type: "success",
          message: translator(`contractNegotiations.${decision}Success`),
          persist: false,
        });
        setTimeout(() => push("/negotiation-manual-approval"), 1200);
      })
      .catch(() => {
        submittingIdsRef.current.delete(id);
        setSubmittingIds(new Set(submittingIdsRef.current));
        showSnackbar({
          type: "error",
          message: translator(`contractNegotiations.${decision}Error`),
          persist: false,
        });
      });
  };


  const { currentPage, navigate } = useListPage();

  return (
    <>
      <ContractNegotiationDialog
        open={isDetailsModalOpen}
        contractNegotiation={openContractNegotiationData.contractNegotiation}
        onClose={() => setIsDetailsModalOpen(false)}
        participantId={connector?.id ?? ""}
        contentStyle={{ maxWidth: "90vw", width: "1000px" }}
        translator={translator}
      />
      <ContractNegotiationsList
        managementUrl={proxyConnectorManagement}
        usePagination
        navigate={navigate}
        currentPage={currentPage}
        firstPage={0}
      >
        <ContractNegotiationsList.Error>
          {({ errors }) => (
            <ErrorPopup
              errors={errors}
              errorMessageKey="common.contractNegotiationsLoadError"
            />
          )}
        </ContractNegotiationsList.Error>
        <ListToolbar
          search={
            <SearchBar
              placeholder={translator(
                "contractNegotiations.searchPlaceholder",
              )}
              searchTarget="counterPartyId"
              searchOperator="ilike"
            />
          }
          pagination={<ContractNegotiationsList.Pagination>{renderPagination}</ContractNegotiationsList.Pagination>}
        />
        <div
          data-testid="approval-list"
          className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200"
        >
          <Table>
            <Table.Head>
              <Table.Row>
                <Table.Heading className="w-16">#</Table.Heading>

                <Table.Heading>
                  <T string="contractNegotiations.headingCreatedAt" />
                </Table.Heading>

                <Table.Heading>
                  <T string="contractNegotiations.headingNegotiationId" />
                </Table.Heading>

                <Table.Heading>
                  <T string="contractNegotiations.headingAssetName" />
                </Table.Heading>

                <Table.Heading>
                  <T string="contractNegotiations.headingCounterPartyId" />
                </Table.Heading>

                <Table.Heading>
                  <T string="contractNegotiations.headingApprove" />
                </Table.Heading>

                <Table.Heading>
                  <T string="contractNegotiations.headingReject" />
                </Table.Heading>
              </Table.Row>
            </Table.Head>

            <Table.Body>
              <ContractNegotiationsList.Items
                limit={MAX_ITEMS}
                sortOrder="DESC"
                sortField="createdAt"
                filterExpression={PENDING_FILTER}
              >
                {({ item, index }) => (
                  <Table.Row
                    key={index}
                    onClick={() => openDetailsModal(item)}
                    data-testid="approval-item"
                  >
                    <Table.Cell>
                      <button
                        type="button"
                        className="flex items-center gap-x-2 text-gray-800"
                      >
                        {currentPage * MAX_ITEMS + (index + 1)}
                      </button>
                    </Table.Cell>
                    <Table.Cell>
                      <CreatedAt item={item} />
                    </Table.Cell>
                    <Table.Cell>
                      <NegotiationId item={item} />
                    </Table.Cell>
                    <Table.Cell>
                      <AssetName item={item} />
                    </Table.Cell>
                    <Table.Cell>
                      <CounterPartyId item={item} />
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        startIcon={<Icon>doneOutline</Icon>}
                        variant="contained"
                        color="success"
                        disabled={submittingIds.has(item["@id"])}
                        onClick={(event) => submitDecision("approve", item, event)}
                      >
                        <T string="contractNegotiations.headingApprove" />
                      </Button>
                    </Table.Cell>
                    <Table.Cell>
                      <Button
                        startIcon={<Icon>close</Icon>}
                        variant="contained"
                        color="error"
                        disabled={submittingIds.has(item["@id"])}
                        onClick={(event) => submitDecision("reject", item, event)}
                      >
                        <T string="contractNegotiations.headingReject" />
                      </Button>
                    </Table.Cell>
                  </Table.Row>
                )}
              </ContractNegotiationsList.Items>
            </Table.Body>
          </Table>
        </div>

        <ContractNegotiationsList.Loading>
          <LoadingSpinner />
        </ContractNegotiationsList.Loading>
      </ContractNegotiationsList>
    </>
  );
}

ContractNegotiationsManualApprovalListPage.titleKey = "contractNegotiations.manualApprovalTitle";
