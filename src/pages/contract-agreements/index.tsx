import { LineTitle } from "@/components/atoms/line-title.tsx";
import PaginationControls from "@/components/molecules/pagination-controls";
import SearchBar from "@/components/molecules/search-bar";
import { Snackbar } from "@/components/molecules/snackbar";
import ContractAgreementCard from "@/components/organisms/contract-agreement-card";
import ContractAgreementDialog from "@/components/organisms/contract-agreement-dialog";
import SideDrawer from "@/components/organisms/side-drawer";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { theme } from "@/theme/ThemeProvider.tsx";
import { operatorIn } from "@/utilities/data-offer";
import { Button, ButtonGroup, Typography } from "@mui/material";
import { ContractAgreement } from "@think-it-labs/edc-connector-client";
import { ContractAgreementsList } from "@think-it-labs/edc-connector-ui/contract-agreements-list";
import { useRouter } from "next/router";
import { SnackbarKey, useSnackbar } from "notistack";
import { useCallback, useMemo, useState } from "react";
import { MAX_ITEMS } from "../../constants/lists";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useTerminatedContractAgreements } from "@/hooks/use-terminated-contract-agreements";
import { useUpdateQueryParams } from "@/hooks/use-update-query-params";

enum StatusFilter {
  All = "All",
  Active = "Active",
  Terminated = "Terminated",
}

export default function ContractAgreementsListPage() {
  const { query } = useRouter()
  const { connector } = useParticipantConnectorState();
  const { translator } = useTranslator();

  const { contractAgreementInfo, retiredContractAgreementIds, rePopulateRetired } = useTerminatedContractAgreements()

  const updateQueryParams = useUpdateQueryParams()

  const selectedStatusFilter: StatusFilter = query.status as StatusFilter || StatusFilter.All
  const statusFilterExpression = useMemo(() => ({
    [StatusFilter.All]: [],
    [StatusFilter.Active]: [],
    [StatusFilter.Terminated]: retiredContractAgreementIds.length ? [{
      operandLeft: "id",
      operator: operatorIn.value,
      operandRight: retiredContractAgreementIds,
    }] : [],
  }), [retiredContractAgreementIds]);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const navigateToPage = useCallback((newPage: number) => {
    updateQueryParams({ page: String(newPage) })
  }, [updateQueryParams])

  const setSelectedStatusFilter = useCallback((statusFilter: StatusFilter) => {
    updateQueryParams({ status: statusFilter })
  }, [updateQueryParams])

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [openContractAgreementData, setOpenContractAgreementData] = useState({
    contractAgreement: {} as ContractAgreement,
  });

  const openDetailsModal = (contractAgreement: ContractAgreement) => {
    setIsDetailsModalOpen(true);
    setOpenContractAgreementData({ contractAgreement });
  };

  if (!connector) {
    return "No connector";
  }

  const openContractAgreementInfo = contractAgreementInfo[openContractAgreementData.contractAgreement.id];

  return (
    <SideDrawer title={<T string="contractAgreements.title" />}>
      <ContractAgreementDialog
        key={openContractAgreementData.contractAgreement.id}
        open={isDetailsModalOpen}
        contractAgreement={openContractAgreementData.contractAgreement}
        retirementReason={openContractAgreementInfo?.retirementReason}
        isTerminated={openContractAgreementInfo?.isTerminated}
        isTerminatedAt={openContractAgreementInfo?.isTerminatedAt}
        isRunning={openContractAgreementInfo?.isRunning}
        onClose={() => setIsDetailsModalOpen(false)}
        onInitSuccess={
          (contractAgreement: ContractAgreement) => {
            if (!contractAgreementInfo[contractAgreement.id]) {
              contractAgreementInfo[contractAgreement.id] = {
                transfersCount: 0,
                isRunning: true,
                retirementReason: "",
                isTerminatedAt: 0,
                isTerminated: false,
              }
            }

            const count = contractAgreementInfo[contractAgreement.id]?.transfersCount || 0
            contractAgreementInfo[contractAgreement.id].transfersCount = count + 1
          }
        }
        onTerminateSuccess={() => {
          rePopulateRetired()
          enqueueSnackbar(translator('contractAgreements.terminationSuccess'), {
            variant: "success",
            content: (key: SnackbarKey) => (
              <Snackbar
                type="success"
                message={translator('contractAgreements.terminationSuccess')}
                onClose={() => { closeSnackbar(key); }}
              />
            )
          });
          setIsDetailsModalOpen(false)
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
        sections={[
          {
            key: "consuming",
            title: <LineTitle title="contractAgreements.titleConsuming" />,
            containerClassName: "flex flex-wrap gap-4 py-4",
            condition: (item) => item.consumerId === connector.id
          },
          {
            key: "providing",
            title: <LineTitle title="contractAgreements.titleProviding" />,
            containerClassName: "flex flex-wrap gap-4 py-4",
            condition: (item) => item.consumerId !== connector.id
          },
        ]}
      >
        <div className="flex flex-wrap justify-end gap-4 pb-6 min-h-[56px]">
          <div className="h-full flex-grow min-w-3xs">
            <SearchBar searchTarget="assetId" placeholder={translator("contractAgreements.searchPlaceholder")}
              searchOperator="ilike" />
          </div>
          <div className="flex gap-x-4 flex-grow">
            <ButtonGroup className="min-h-[54px]" color="info" variant="outlined" sx={{
              ".MuiButtonGroup-grouped": {
                borderColor: theme.palette.info.main,
              }
            }}>
              {Object.keys(StatusFilter).map((filter) => (
                <Button
                  key={filter}
                  variant={selectedStatusFilter === filter ? "contained" : "outlined"}
                  onClick={() => setSelectedStatusFilter(filter as StatusFilter)}
                >
                  <Typography variant="button" component="span" className="break-keep">
                    <T string={`contractAgreements.${filter.toLowerCase()}Contracts`} />
                  </Typography>
                </Button>
              ))}
            </ButtonGroup>
          </div>
          <div className="flex justify-end items-center">
            <ContractAgreementsList.Pagination>
              {({ decrementPage, hasPrev, hasNext, incrementPage, page, itemsCount }) =>
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
              }
            </ContractAgreementsList.Pagination>
          </div>
        </div>

        <ContractAgreementsList.Error>
          {({ error }) => {
            if (error) {
              enqueueSnackbar(translator("common.contractAgreementsLoadError"), {
                variant: "error",
                content: (key: any) => (
                  <Snackbar
                    type="error"
                    message={translator('common.contractAgreementsLoadError')}
                    details={error.message || undefined}
                    onClose={() => { closeSnackbar(key); }}
                  />
                )
              });
            }
            return <></>;
          }}
        </ContractAgreementsList.Error>

        <div className="flex flex-col flex-wrap gap-4 py-4" data-testid="contract-agreements-list">
          <ContractAgreementsList.Items
            limit={MAX_ITEMS}
            sortOrder="DESC"
            filterExpression={statusFilterExpression[selectedStatusFilter]}
          >
            {({ item, index }) => {
              if (selectedStatusFilter === StatusFilter.Active && retiredContractAgreementIds.includes(item.id)) {
                return <></>;
              }
              return <ContractAgreementCard
                key={index}
                contractAgreement={item}
                onClick={() => openDetailsModal(item)}
                isTerminated={retiredContractAgreementIds.includes(item.id)}
                isRunning={contractAgreementInfo[item.id]?.isRunning}
                transferCount={contractAgreementInfo[item.id]?.transfersCount}
                data-testid="contract-agreement-card"
              />;
            }}
          </ContractAgreementsList.Items>
        </div>

        <ContractAgreementsList.Loading>
          <div className="max-w-20 mx-auto mt-4 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5">
            <span
              className="animate-spin mx-auto inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </span>
          </div>
        </ContractAgreementsList.Loading>
      </ContractAgreementsList>
    </SideDrawer>
  );
}
