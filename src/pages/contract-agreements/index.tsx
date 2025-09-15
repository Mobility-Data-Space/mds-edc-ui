import { LoadingSpinner } from "@/components/atoms/loading-spinner";
import RadioButtonsGroup from "@/components/atoms/radio-group";
import PaginationControls from "@/components/molecules/pagination-controls";
import SearchBar from "@/components/molecules/search-bar";
import { Snackbar } from "@/components/molecules/snackbar";
import ContractAgreementCard from "@/components/organisms/contract-agreement-card";
import ContractAgreementDialog from "@/components/organisms/contract-agreement-dialog";
import SideDrawer from "@/components/organisms/side-drawer";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { useUpdateQueryParams } from "@/hooks/use-update-query-params";
import { T, useTranslator } from "@/i18n";
import { theme } from "@/theme/ThemeProvider.tsx";
import { operatorIn } from "@/utilities/data-offer";
import { Button, ButtonGroup, Icon, Typography } from "@mui/material";
import {
  ContractAgreement,
  CriterionInput,
} from "@think-it-labs/edc-connector-client";
import { ContractAgreementsList } from "@think-it-labs/edc-connector-ui/contract-agreements-list";
import { useRouter } from "next/router";
import { SnackbarKey, useSnackbar } from "notistack";
import { useCallback, useMemo, useState } from "react";
import { ErrorPopup } from "../../components/molecules/error-popup";
import { MAX_ITEMS } from "../../constants/lists";

type OwnershipFilter = "all" | "provider" | "consumer";

enum StatusFilter {
  All = "All",
  Active = "Active",
  Terminated = "Terminated",
}

export default function ContractAgreementsListPage() {
  const { query } = useRouter();
  const { connector } = useParticipantConnectorState();
  const { translator } = useTranslator();

  const updateQueryParams = useUpdateQueryParams();

  const selectedStatusFilter: StatusFilter =
    (query.status as StatusFilter) || StatusFilter.All;
  const statusFilterExpression = useMemo(
    () => ({
      [StatusFilter.All]: undefined,
      [StatusFilter.Active]: undefined,
      [StatusFilter.Terminated]: {
        operandLeft: "id",
        operator: operatorIn.value,
        operandRight: [""],
      },
    }),
    [],
  );

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const navigateToPage = useCallback(
    (newPage: number) => {
      updateQueryParams({ page: String(newPage) });
    },
    [updateQueryParams],
  );

  const setSelectedStatusFilter = useCallback(
    (statusFilter: StatusFilter) => {
      updateQueryParams({ status: statusFilter, page: String(0) });
    },
    [updateQueryParams],
  );

  const selectedOwnershipFilter: OwnershipFilter =
    (query.owner as OwnershipFilter) || "all";
  const setOwnershipFilter = useCallback(
    (ownershipFilter: OwnershipFilter) => {
      updateQueryParams({ page: String(0), owner: ownershipFilter });
    },
    [updateQueryParams],
  );

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [openContractAgreementData, setOpenContractAgreementData] = useState({
    contractAgreement: {} as ContractAgreement,
  });

  const openDetailsModal = (contractAgreement: ContractAgreement) => {
    setIsDetailsModalOpen(true);
    setOpenContractAgreementData({ contractAgreement });
  };

  // const openContractAgreementInfo = contractAgreementInfo[openContractAgreementData.contractAgreement.id];

  const getFilterExpression = useMemo(() => {
    const filters: CriterionInput[] = [];
    if (statusFilterExpression[selectedStatusFilter]) {
      filters.push(statusFilterExpression[selectedStatusFilter]);
    }

    if (connector.id) {
      if (selectedOwnershipFilter === "provider") {
        filters.push({
          operandLeft: "providerId",
          operator: "=",
          operandRight: connector.id,
        });
      }

      if (selectedOwnershipFilter === "consumer") {
        filters.push({
          operandLeft: "consumerId",
          operator: "=",
          operandRight: connector.id,
        });
      }
    }

    return filters;
  }, [statusFilterExpression, selectedOwnershipFilter, connector.id]);

  if (!connector) {
    return "No connector";
  }

  return (
    <SideDrawer title={<T string="contractAgreements.title" />}>
      <ContractAgreementDialog
        key={openContractAgreementData.contractAgreement.id}
        open={isDetailsModalOpen}
        contractAgreement={openContractAgreementData.contractAgreement}
        // retirementReason={openContractAgreementInfo?.retirementReason}
        // isTerminated={openContractAgreementInfo?.isTerminated}
        // isTerminatedAt={openContractAgreementInfo?.isTerminatedAt}
        // isRunning={openContractAgreementInfo?.isRunning}
        retirementReason={""}
        isTerminated={false}
        isTerminatedAt={0}
        isRunning={true}
        onClose={() => setIsDetailsModalOpen(false)}
        onInitSuccess={(contractAgreement: ContractAgreement) => {
          // if (!contractAgreementInfo[contractAgreement.id]) {
          //   contractAgreementInfo[contractAgreement.id] = {
          //     transfersCount: 0,
          //     isRunning: true,
          //     retirementReason: "",
          //     isTerminatedAt: 0,
          //     isTerminated: false,
          //   }
          // }
          // const count = contractAgreementInfo[contractAgreement.id]?.transfersCount || 0
          // contractAgreementInfo[contractAgreement.id].transfersCount = count + 1
        }}
        onTerminateSuccess={() => {
          // rePopulateRetired()
          enqueueSnackbar(translator("contractAgreements.terminationSuccess"), {
            variant: "success",
            content: (key: SnackbarKey) => (
              <Snackbar
                type="success"
                message={translator("contractAgreements.terminationSuccess")}
                onClose={() => {
                  closeSnackbar(key);
                }}
              />
            ),
          });
          setIsDetailsModalOpen(false);
        }}
        participantId={connector.id}
        connectorEndpoint={connector.protocolUrl}
        managementUrl={proxyConnectorManagement}
        contentStyle={{ maxWidth: "90vw", width: "1000px" }}
        translator={translator}
      />

      <ContractAgreementsList
        managementUrl={proxyConnectorManagement}
        usePagination={true}
        navigate={navigateToPage}
        currentPage={parseInt(query.page as string) || 0}
        firstPage={0}
      >
        <div className="flex flex-wrap justify-end gap-4 pb-6 min-h-[56px]">
          <div className="h-full flex-grow min-w-3xs">
            <SearchBar
              searchTarget="assetId"
              placeholder={translator("contractAgreements.searchPlaceholder")}
              searchOperator="ilike"
            />
          </div>
          <div className="flex gap-x-4 flex-grow">
            <ButtonGroup
              className="min-h-[54px]"
              color="info"
              variant="outlined"
              sx={{
                ".MuiButtonGroup-grouped": {
                  borderColor: theme.palette.info.main,
                },
              }}
            >
              {Object.keys(StatusFilter).map((filter) => (
                <Button
                  key={filter}
                  variant={
                    selectedStatusFilter === filter ? "contained" : "outlined"
                  }
                  onClick={() =>
                    setSelectedStatusFilter(filter as StatusFilter)
                  }
                >
                  <Typography
                    variant="button"
                    component="span"
                    className="break-keep"
                  >
                    <T
                      string={`contractAgreements.${filter.toLowerCase()}Contracts`}
                    />
                  </Typography>
                </Button>
              ))}
            </ButtonGroup>
          </div>
          <div className="flex justify-end items-center">
            <ContractAgreementsList.Pagination>
              {({
                decrementPage,
                hasPrev,
                hasNext,
                incrementPage,
                page,
                itemsCount,
              }) => (
                <PaginationControls
                  page={page}
                  hasPrev={hasPrev}
                  hasNext={hasNext}
                  decrementPage={decrementPage}
                  incrementPage={incrementPage}
                  maxItems={MAX_ITEMS}
                  dataTestIdPrefix="pagination"
                  itemsCount={itemsCount}
                />
              )}
            </ContractAgreementsList.Pagination>
          </div>
        </div>

        <ContractAgreementsList.Error>
          {({ errors }) => (
            <ErrorPopup
              errors={errors}
              errorMessageKey="common.contractAgreementsLoadError"
            />
          )}
        </ContractAgreementsList.Error>

        <div className="flex gap-6 py-4" data-testid="contract-agreements-list">
          <div className="flex flex-wrap gap-4 flex-1 min-h-[60vh]">
            <ContractAgreementsList.Items
              limit={MAX_ITEMS}
              sortOrder="DESC"
              sortField="contractSigningDate"
              filterExpression={getFilterExpression}
              emptyMessage={
                <div
                  className={
                    "size-full flex flex-col items-center justify-center"
                  }
                >
                  <Icon style={{ fontSize: "0px" }}>info</Icon>

                  <Typography variant="h6" component="h6" color="info">
                    <T string="contractAgreements.noContractsFound" />
                  </Typography>
                </div>
              }
            >
              {({ item, index }) => {
                // if (selectedStatusFilter === StatusFilter.Active && retiredContractAgreementIds.includes(item.id)) {
                if (
                  selectedStatusFilter === StatusFilter.Active &&
                  [""].includes(item.id)
                ) {
                  return <></>;
                }
                return (
                  <ContractAgreementCard
                    key={index}
                    contractAgreement={
                      item as ContractAgreement & {
                        isTerminated: boolean;
                        isRunning: boolean;
                        transferCount: number;
                      }
                    }
                    onClick={() => openDetailsModal(item)}
                    data-testid="contract-agreement-card"
                  />
                );
              }}
            </ContractAgreementsList.Items>
            <ContractAgreementsList.Loading>
              <div className="size-full min-h-[60vh] flex items-center justify-center">
                <LoadingSpinner />
              </div>
            </ContractAgreementsList.Loading>
          </div>

          <div className="w-56 shrink-0">
            <RadioButtonsGroup
              name="ownershipFilter"
              id="ownershipFilter"
              defaultValue={selectedOwnershipFilter}
              value={selectedOwnershipFilter}
              options={[
                { text: "All", value: "all" },
                { text: "Provider", value: "provider" },
                { text: "Consumer", value: "consumer" },
              ]}
              onChange={(ownershipFilter) =>
                setOwnershipFilter(ownershipFilter as OwnershipFilter)
              }
            />
          </div>
        </div>

        <ContractAgreementsList.Loading>
          <LoadingSpinner />
        </ContractAgreementsList.Loading>
      </ContractAgreementsList>
    </SideDrawer>
  );
}
