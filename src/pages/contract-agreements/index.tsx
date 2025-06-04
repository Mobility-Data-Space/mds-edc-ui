import React, {useEffect, useState} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {Divider, IconButton} from "@mui/material";
import { ContractAgreementsList } from "@think-it-labs/edc-connector-ui/contract-agreements-list";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { usePagination } from "@/hooks/use-pagination";
import { T, useTranslator } from "@/i18n";
import SideDrawer from "@/components/organisms/side-drawer";
import ContractAgreementCard from "@/components/organisms/contract-agreement-card";
import ContractAgreementDialog from "@/components/organisms/contract-agreement-dialog";
import {ContractAgreement, TransferProcessStates} from "@think-it-labs/edc-connector-client";
import Typography from "@mui/material/Typography";
import {useEdcConnectorClient} from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";
import {STATE_RUNNING} from "@/constants/transfer-process";
import {AgreementsRetirementController} from "@/utilities/contract-agreement";

interface ContractAgreementInfo {
  [key: string]: {
    isTerminated: boolean,
    isRunning: boolean,
    transfersCount: number,
  }
}

export default function ContractAgreementsListPage() {
  const { connector } = useParticipantConnectorState();
  const managementUrl = connector?.managementUrl as string;

  const { translator } = useTranslator();

  const { decrementPage, incrementPage, offset, limit, hasPrev, page } =
    usePagination();

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [openContractAgreementData, setOpenContractAgreementData] = useState({
    contractAgreement: {} as ContractAgreement,
  });

  const openDetailsModal = (contractAgreement: ContractAgreement) => {
    setIsDetailsModalOpen(true);
    setOpenContractAgreementData({ contractAgreement });
  };

  const edcClient = useEdcConnectorClient({management: managementUrl});

  const [contractAgreementInfo, setContractAgreementInfo] = useState<ContractAgreementInfo>({});
  const [retiredContractAgreements, setretiredContractAgreements] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    edcClient.management.transferProcesses.queryAll({ offset: 0 }).then((transferProcesses) => {
      const contractAgreement: ContractAgreementInfo = {};

      transferProcesses.forEach(transferProcess => {
        const contractAgreementId = transferProcess.contractId;
        if (contractAgreement[contractAgreementId]) {
          contractAgreement[contractAgreementId].transfersCount++;
          if (contractAgreement[contractAgreementId].isTerminated !== true) {
            contractAgreement[contractAgreementId].isTerminated = transferProcess.state === TransferProcessStates.TERMINATED;
          } else if (contractAgreement[contractAgreementId].isRunning !== true) {
            contractAgreement[contractAgreementId].isRunning = transferProcess.state === STATE_RUNNING;
          }
        } else {
          contractAgreement[contractAgreementId] = {
            isTerminated: transferProcess.state === TransferProcessStates.TERMINATED,
            isRunning: transferProcess.state !== TransferProcessStates.TERMINATED && transferProcess.state === STATE_RUNNING,
            transfersCount: 1,
          };
        }
      });
      setContractAgreementInfo(contractAgreement);
    });
  }, [edcClient]);


  useEffect(() => {
    const controller = new AgreementsRetirementController(managementUrl)
    controller.retiredAgreementsRequest().then(retiredAgreements => {
      const contractAgreementsReasons: { [key: string]: string } = {};
      retiredAgreements.forEach(retiredContractAgreement => {
        contractAgreementsReasons[retiredContractAgreement.agreementId] = retiredContractAgreement["https://w3id.org/tractusx/v0.0.1/ns/reason"];
      });
      setretiredContractAgreements(contractAgreementsReasons);
    });
  }, []);

  if (!connector) {
    return "No connector";
  }

  return (
    <SideDrawer title={<T string="contractAgreements.title" />}>
      <ContractAgreementDialog
        open={isDetailsModalOpen}
        contractAgreement={openContractAgreementData.contractAgreement}
        retirementReason={retiredContractAgreements[openContractAgreementData.contractAgreement.id]}
        onClose={() => setIsDetailsModalOpen(false)}
        participantId={connector.id}
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
                <ChevronLeft className="size-6"/>
              </IconButton>
              <IconButton
                onClick={incrementPage}
              >
                <ChevronRight className="size-6"/>
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
              operandLeft: "consumerId",
              operator: "=",
              operandRight: connector.id
            }]}
          >
            {({item, index}) =>
              <ContractAgreementCard
                key={index}
                contractAgreement={item}
                isTerminated={contractAgreementInfo[item.id]?.isTerminated}
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
                <ChevronLeft className="size-6"/>
              </IconButton>
              <IconButton
                onClick={incrementPage}
              >
                <ChevronRight className="size-6"/>
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
            {({item, index}) =>
              <ContractAgreementCard
                key={index}
                contractAgreement={item}
                isTerminated={contractAgreementInfo[item.id]?.isTerminated}
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
    </SideDrawer>
  );
}
