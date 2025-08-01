import { Snackbar } from "@/components/molecules/snackbar";
import { proxyConnectorManagement } from "@/constants/proxy";
import { STATE_RUNNING } from "@/constants/transfer-process";
import { useTranslator } from "@/i18n";
import { AgreementsRetirementController, RetiredContractAgreement, AGREEMENT_RETIREMENT_DATE, AGREEMENT_RETIREMENT_REASON } from "@/utilities/contract-agreement";
import { TransferProcessStates } from "@think-it-labs/edc-connector-client";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";
import { enqueueSnackbar, SnackbarKey, closeSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";

export const useTerminatedProcesses = () => {
  const edcClient = useEdcConnectorClient({ management: proxyConnectorManagement });
  const { translator } = useTranslator();

  const [retiredContractAgreementIds, setRetiredContractAgreementIds] = useState<string[]>([]);
  const [contractAgreementInfo, setContractAgreementInfo] = useState<ContractAgreementInfo>({});

  const populateRetired = useCallback(() => {
    const controller = new AgreementsRetirementController(proxyConnectorManagement)
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
        setRetiredContractAgreementIds(retiredAgreementsList);
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
  }, [edcClient, enqueueSnackbar, closeSnackbar, translator]);

  useEffect(() => {
    populateRetired()
  }, [populateRetired])

  return { retiredContractAgreementIds, contractAgreementInfo, rePopulateRetired: populateRetired }
}
