import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, ButtonGroup, IconButton } from "@mui/material";
import { ContractAgreementsList } from "@think-it-labs/edc-connector-ui/contract-agreements-list";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import SideDrawer from "@/components/organisms/side-drawer";
import ContractAgreementCard from "@/components/organisms/contract-agreement-card";
import ContractAgreementDialog from "@/components/organisms/contract-agreement-dialog";
import { ContractAgreement, TransferProcessStates } from "@think-it-labs/edc-connector-client";
import Typography from "@mui/material/Typography";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";
import { AGREEMENT_RETIREMENT_DATE, AGREEMENT_RETIREMENT_REASON, AgreementsRetirementController, RetiredContractAgreement } from "@/utilities/contract-agreement";
import { STATE_RUNNING } from "@/constants/transfer-process.ts";
import { enqueueSnackbar } from "notistack";
import { List } from "@think-it-labs/edc-connector-ui/list";
import { useRouter } from "next/router";
import { operatorEquals, operatorIn } from "@/utilities/policy-constraints.ts";
import { theme } from "@/theme/ThemeProvider.tsx";
import { LineTitle } from "@/components/atoms/line-title.tsx";

const MAX_ITEMS = 25

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
  const { connector } = useParticipantConnectorState();
  const managementUrl = connector?.managementUrl as string;
  const [retiredContractAgreementIds, setRetiredContractAgreementIds] = useState<string[]>([]);
  const [contractAgreementInfo, setContractAgreementInfo] = useState<ContractAgreementInfo>({});

  const { translator } = useTranslator();

  const [selectedTypeFilter, setSelectedTypeFilter] = useState<TypeFilter>(TypeFilter.Consuming);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<StatusFilter>(StatusFilter.All);
  const typeFilterExpression = useMemo(() => ({
    [TypeFilter.Consuming]: [{
      operandLeft: "consumerId",
      operator: operatorEquals.value,
      operandRight: connector.id
    }],
    [TypeFilter.Providing]: [{
      operandLeft: "providerId",
      operator: operatorEquals.value,
      operandRight: connector.id
    }],
  }), [connector.id]);
  const statusFilterExpression = useMemo(() => ({
    [StatusFilter.All]: [],
    [StatusFilter.Active]: [],
    [StatusFilter.Terminated]: [{
      operandLeft: "id",
      operator: operatorIn.value,
      operandRight: retiredContractAgreementIds,
    }],
  }), [contractAgreementInfo]);

  const filterExpression = statusFilterExpression[selectedStatusFilter];

  const { push, query } = useRouter()

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

  }, [])

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [openContractAgreementData, setOpenContractAgreementData] = useState({
    contractAgreement: {} as ContractAgreement,
  });

  const openDetailsModal = (contractAgreement: ContractAgreement) => {
    setIsDetailsModalOpen(true);
    setOpenContractAgreementData({ contractAgreement });
  };

  const edcClient = useEdcConnectorClient({ management: managementUrl });

  const populateRetired = () => {
    const controller = new AgreementsRetirementController(managementUrl)
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
    }).catch(error => enqueueSnackbar("contractAgreements.retiredFetchError"));
  };

  useEffect(() => {
    populateRetired();
  }, [edcClient]);

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
        onTerminateSuccess={populateRetired}
        participantId={connector.id}
        connectorEndpoint={connector.protocolUrl}
        managementUrl={connector.managementUrl}
        contentStyle={{ maxWidth: "90vw", width: "1000px" }}
        translator={translator}
      />

      <ContractAgreementsList
        managementUrl={managementUrl}
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
        <div className="flex justify-between gap-x-5">
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
                  <Typography color="textPrimary" variant="body2" className="font-bold">
                    <T string={`contractAgreements.${filter.toLowerCase()}Contracts`} />
                  </Typography>
                </Button>
              ))}
            </ButtonGroup>
          </div>
          <List.Pagination>
            {({ decrementPage, hasPrev, hasNext, incrementPage }) =>
              <div className="flex justify-end items-center">
                <div className="inline-flex float-right gap-x-2">
                  <IconButton
                    onClick={decrementPage}
                    disabled={!hasPrev}
                  >
                    <ChevronLeft className="size-6" />
                  </IconButton>
                  <IconButton
                    onClick={incrementPage}
                    disabled={!hasNext}
                  >
                    <ChevronRight className="size-6" />
                  </IconButton>
                </div>
              </div>
            }
          </List.Pagination>
        </div>

        <div className="flex flex-col flex-wrap gap-4 py-4">
          <ContractAgreementsList.Items
            limit={MAX_ITEMS}
            sortOrder="DESC"
            filterExpression={statusFilterExpression[selectedStatusFilter]}
          >
            {({ item, index }) => {
              if (selectedStatusFilter === StatusFilter.Active && retiredContractAgreementIds.includes(item.id)) {
                return <></>;
              }
              return (
                <ContractAgreementCard
                  key={index}
                  contractAgreement={item}
                  isTerminated={contractAgreementInfo[item.id]?.isTerminated}
                  isRunning={contractAgreementInfo[item.id]?.isRunning}
                  transferCount={contractAgreementInfo[item.id]?.transfersCount}
                  onClick={() => openDetailsModal(item)}
                />
              );
            }}
          </ContractAgreementsList.Items>
        </div>
        <ContractAgreementsList.Loading>
          <div className="max-w-20 mx-auto my-4 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5">
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
