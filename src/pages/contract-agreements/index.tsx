import { LineTitle } from "@/components/atoms/line-title.tsx";
import PaginationControls from "@/components/molecules/pagination-controls";
import SearchBar from "@/components/molecules/search-bar";
import { Snackbar } from "@/components/molecules/snackbar";
import ContractAgreementCard from "@/components/organisms/contract-agreement-card";
import ContractAgreementDialog from "@/components/organisms/contract-agreement-dialog";
import SideDrawer from "@/components/organisms/side-drawer";
import { STATE_RUNNING } from "@/constants/transfer-process.ts";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { theme } from "@/theme/ThemeProvider.tsx";
import { AGREEMENT_RETIREMENT_DATE, AGREEMENT_RETIREMENT_REASON, AgreementsRetirementController, RetiredContractAgreement } from "@/utilities/contract-agreement";
import { operatorEqual, operatorIn } from "@/utilities/data-offer";
import { Button, ButtonGroup } from "@mui/material";
import { ContractAgreement, TransferProcessStates } from "@think-it-labs/edc-connector-client";
import { ContractAgreementsList } from "@think-it-labs/edc-connector-ui/contract-agreements-list";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";
import { useRouter } from "next/router";
import { SnackbarKey, useSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MAX_ITEMS } from "../../constants/lists";

enum TypeFilter {
  Consuming = "Consuming",
  Providing = "Providing",
}

enum StatusFilter {
  All = "All",
  Active = "Active",
  Terminated = "Terminated",
}

interface ContractAgreementInfo {
  [key: string]: {
    isTerminated: boolean,
    isTerminatedAt: number,
    retirementReason: string,
    isRunning: boolean,
    transfersCount: number,
  }
}

export default function ContractAgreementsListPage() {
  const { push, query } = useRouter()
  const { connector } = useParticipantConnectorState();
  const [retiredContractAgreementIds, setRetiredContractAgreementIds] = useState<string[]>([]);
  const [contractAgreementInfo, setContractAgreementInfo] = useState<ContractAgreementInfo>({});


  const { translator } = useTranslator();

  const [selectedTypeFilter, setSelectedTypeFilter] = useState<TypeFilter>(TypeFilter.Consuming);
  const selectedStatusFilter: StatusFilter = query.status as StatusFilter || StatusFilter.All
  const typeFilterExpression = useMemo(() => ({
    [TypeFilter.Consuming]: [{
      operandLeft: "consumerId",
      operator: operatorEqual.value,
      operandRight: connector.id
    }],
    [TypeFilter.Providing]: [{
      operandLeft: "providerId",
      operator: operatorEqual.value,
      operandRight: connector.id
    }],
  }), [connector.id]);
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

  const navigate = useCallback((newPage: number) => {
    push(
      {
        href: window.location.href,
        query: {
          ...query,
          page: newPage,
        },
      },
    );

  }, [push, query])

  const setSelectedStatusFilter = useCallback((statusFilter: StatusFilter) => {
    push(
      {
        href: window.location.href,
        query: {
          ...query,
          status: statusFilter
        }
      }
    )
  }, [])

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [openContractAgreementData, setOpenContractAgreementData] = useState({
    contractAgreement: {} as ContractAgreement,
  });

  const openDetailsModal = (contractAgreement: ContractAgreement) => {
    setIsDetailsModalOpen(true);
    setOpenContractAgreementData({ contractAgreement });
  };

  const edcClient = useEdcConnectorClient({ management: connector.managementUrl });

  const populateRetired = useCallback(() => {
    const controller = new AgreementsRetirementController(connector.managementUrl)
    controller.retiredAgreementsRequest().then(retiredAgreements => {
      setRetiredContractAgreementIds(retiredAgreements.map(contractAgreement => contractAgreement.agreementId as string));
      const retiredContractAgreementsToSave: { [key: string]: RetiredContractAgreement } = {};
      retiredAgreements.forEach(retiredContractAgreement => {
        retiredContractAgreementsToSave[retiredContractAgreement.agreementId] = retiredContractAgreement;
      });

      edcClient.management.transferProcesses.queryAll({ offset: 0 }).then((transferProcesses) => {
        const contractAgreementInfoToSave: ContractAgreementInfo = {};
        const retiredAgreementsList = Object.keys(retiredContractAgreementsToSave);
        transferProcesses.forEach(transferProcess => {
          const contractAgreementId = transferProcess.contractId;
          if (contractAgreementInfoToSave[contractAgreementId]) {
            contractAgreementInfoToSave[contractAgreementId].transfersCount++;
            if (contractAgreementInfoToSave[contractAgreementId].isRunning !== true) {
              contractAgreementInfoToSave[contractAgreementId].isRunning = transferProcess.state === STATE_RUNNING;
            }
          } else {
            const retiredContractAgreement = retiredContractAgreementsToSave[contractAgreementId] || {};
            contractAgreementInfoToSave[contractAgreementId] = {
              isTerminated: retiredAgreementsList.includes(contractAgreementId),
              isRunning: transferProcess.state !== TransferProcessStates.TERMINATED && transferProcess.state === STATE_RUNNING,
              isTerminatedAt: retiredContractAgreement[AGREEMENT_RETIREMENT_DATE] as number,
              retirementReason: retiredContractAgreement[AGREEMENT_RETIREMENT_REASON] as string,
              transfersCount: 1,
            };
          }
        });
        setContractAgreementInfo(contractAgreementInfoToSave);
      });
    }).catch((error) => enqueueSnackbar(translator("contractAgreements.retiredFetchError"),
      {
        variant: "error",
        content: (key: SnackbarKey) =>
          <Snackbar
            type="error"
            message={translator('contractAgreements.retiredFetchError')}
            content={error}
            onClose={() => { closeSnackbar(key); }}
          />
      }));
  }, [edcClient, enqueueSnackbar]);

  useEffect(() => {
    populateRetired();
  }, [populateRetired, edcClient]);

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
        onTerminateSuccess={() => {
          populateRetired()
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
        managementUrl={connector.managementUrl}
        contentStyle={{ maxWidth: "90vw", width: "1000px" }}
        translator={translator}
      />

      <ContractAgreementsList
        managementUrl={connector.managementUrl}
        usePagination={true}
        navigate={navigate}
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
        <div className="flex justify-between gap-x-5 pb-6">
          <div className="flex justify-start gap-x-5 items-center">
            <div className="h-full min-w-xl">
              <SearchBar searchTarget="assetId" placeholder={translator("contractAgreements.searchPlaceholder")} searchOperator="ilike" />
            </div>
            <div className="flex gap-x-4">
              <ButtonGroup color="info" variant="outlined" sx={{
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
                    <T string={`contractAgreements.${filter.toLowerCase()}Contracts`} />
                  </Button>
                ))}
              </ButtonGroup>
            </div>
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
              if (selectedStatusFilter === StatusFilter.Active && retiredContractAgreementIds.includes(item.id)) { return <></> }
              return <ContractAgreementCard
                key={index}
                contractAgreement={item}
                onClick={() => openDetailsModal(item)}
                isTerminated={retiredContractAgreementIds.includes(item.id)}
                isRunning={contractAgreementInfo[item.id]?.isRunning}
                transferCount={contractAgreementInfo[item.id]?.transfersCount}
                data-testid="contract-agreement-card"
              />
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
