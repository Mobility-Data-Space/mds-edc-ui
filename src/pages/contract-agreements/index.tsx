import React, { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Divider, IconButton } from "@mui/material";
import { ContractAgreementsList } from "@think-it-labs/edc-connector-ui/contract-agreements-list";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { usePagination } from "@/hooks/use-pagination";
import { T, useTranslator } from "@/i18n";
import SideDrawer from "@/components/organisms/side-drawer";
import ContractAgreementCard from "@/components/organisms/contract-agreement-card";
import ContractAgreementDialog from "@/components/organisms/contract-agreement-dialog";
import { ContractAgreement, TransferProcessStates } from "@think-it-labs/edc-connector-client";
import Typography from "@mui/material/Typography";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";
import { AGREEMENT_RETIREMENT_DATE, AGREEMENT_RETIREMENT_REASON, AgreementsRetirementController, RetiredContractAgreement } from "@/utilities/contract-agreement";
import { STATE_RUNNING } from "@/constants/transfer-process.ts";

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

  const { translator } = useTranslator();

  const { decrementPage, incrementPage, offset, limit, hasPrev, page, setHasNext, hasNext } =
    usePagination();


  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [openContractAgreementData, setOpenContractAgreementData] = useState({
    contractAgreement: {} as ContractAgreement,
  });

  const openDetailsModal = (contractAgreement: ContractAgreement) => {
    setIsDetailsModalOpen(true);
    setOpenContractAgreementData({ contractAgreement });
  };

  const edcClient = useEdcConnectorClient({ management: managementUrl });

  const [contractAgreementInfo, setContractAgreementInfo] = useState<ContractAgreementInfo>({});

  useEffect(() => {
    const controller = new AgreementsRetirementController(managementUrl)
    controller.retiredAgreementsRequest().then(retiredAgreements => {
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
    });
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
        participantId={connector.id}
        connectorEndpoint={connector.protocolUrl}
        managementUrl={connector.managementUrl}
        contentStyle={{ maxWidth: "90vw", width: "1000px" }}
        translator={translator}
      />
      <ContractAgreementsList managementUrl={managementUrl}>
        <div className="flex justify-between gap-x-5">
          <Typography variant="h4" >
            <T string="contractAgreements.titleConsuming" />
          </Typography>

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
        </div>

        <div className="flex flex-wrap gap-4 py-4">
          <ContractAgreementsList.Items
            limit={limit + 1}
            offset={offset}
            sortOrder="DESC"
            filterExpression={[{
              operandLeft: "consumerId",
              operator: "=",
              operandRight: connector.id
            }]}
          >
            {({ item, index, items }) => {
              if (items?.length <= limit) {
                setHasNext(false)
              } else {
                setHasNext(true)
              }
              return index < limit ? (
                <ContractAgreementCard
                  key={index}
                  contractAgreement={item}
                  isTerminated={contractAgreementInfo[item.id]?.isTerminated}
                  isRunning={contractAgreementInfo[item.id]?.isRunning}
                  transferCount={contractAgreementInfo[item.id]?.transfersCount}
                  onClick={() => openDetailsModal(item)}
                />
              ) : <></>;
            }}
          </ContractAgreementsList.Items >
        </div >
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
      </ContractAgreementsList >

      <Divider className="!mb-3" />

      <ContractAgreementsList managementUrl={managementUrl}>
        <div className="flex justify-between gap-x-5">
          <Typography variant="h4">
            <T string="contractAgreements.titleProviding" />
          </Typography>

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
              >
                <ChevronRight className="size-6" />
              </IconButton>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 py-4">
          <ContractAgreementsList.Items
            limit={limit}
            offset={offset}
            sortOrder="DESC"
            filterExpression={[{
              operandLeft: "providerId",
              operator: "=",
              operandRight: connector.id
            }]}
          >
            {({ item, index }) =>
              <ContractAgreementCard
                key={index}
                contractAgreement={item}
                isTerminated={contractAgreementInfo[item.id]?.isTerminated}
                isRunning={contractAgreementInfo[item.id]?.isRunning}
                transferCount={contractAgreementInfo[item.id]?.transfersCount}
                onClick={() => openDetailsModal(item)}
              />
            }
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
    </SideDrawer >
  );
}
