import { Snackbar } from "@/components/molecules/snackbar";
import { proxyConnectorManagement } from "@/constants/proxy";
import { STATE_RUNNING } from "@/constants/transfer-process";
import { useTranslator } from "@/i18n";
import {
  AgreementsRetirementController,
  AGREEMENT_RETIREMENT_DATE,
  AGREEMENT_RETIREMENT_REASON,
} from "@/utilities/contract-agreement";
import { TransferProcessStates } from "@think-it-labs/edc-connector-client";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";
import { enqueueSnackbar, SnackbarKey, closeSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";

export const useTerminatedContractAgreements = () => {
  const edcClient = useEdcConnectorClient({
    management: proxyConnectorManagement,
  });
  const { translator } = useTranslator();

  const [retiredContractAgreementIds, setRetiredContractAgreementIds] =
    useState<string[]>([]);
  const [contractAgreementInfo, setContractAgreementInfo] = useState<
    Record<string, ContractAgreementInfo>
  >({});
  const [loading, setLoading] = useState<boolean>(false);

  const populateRetired = useCallback(async () => {
    setLoading(true);
    const controller = new AgreementsRetirementController(
      proxyConnectorManagement,
    );

    try {
      const retiredAgreements = await controller.retiredAgreementsRequest();

      const retiredContractAgreementsToSave = new Map(
        retiredAgreements.map(
          (retiredAgreement) =>
            [retiredAgreement.agreementId, retiredAgreement] as const,
        ),
      );

      const transferProcesses =
        await edcClient.management.transferProcesses.queryAll({ offset: 0 });

      const contractAgreementInfoToSave = new Map<
        string,
        ContractAgreementInfo
      >();

      transferProcesses.forEach((transferProcess) => {
        const contractAgreementId = transferProcess.contractId;
        const contractAgreement =
          contractAgreementInfoToSave.get(contractAgreementId);

        if (contractAgreement) {
          contractAgreement.transfersCount++;

          if (contractAgreement.isRunning !== true) {
            contractAgreement.isRunning =
              transferProcess.state === STATE_RUNNING;
          }
        } else {
          const retiredContractAgreement =
            retiredContractAgreementsToSave.get(contractAgreementId);

          if (retiredContractAgreement) {
            contractAgreementInfoToSave.set(contractAgreementId, {
              isTerminated:
                retiredContractAgreementsToSave.has(contractAgreementId),
              isRunning:
                transferProcess.state !== TransferProcessStates.TERMINATED &&
                transferProcess.state === STATE_RUNNING,
              isTerminatedAt: retiredContractAgreement[
                AGREEMENT_RETIREMENT_DATE
              ] as number,
              retirementReason: retiredContractAgreement[
                AGREEMENT_RETIREMENT_REASON
              ] as string,
              transfersCount: 1,
            });
          }
        }
      });

      setContractAgreementInfo(Object.fromEntries(contractAgreementInfoToSave));
      setRetiredContractAgreementIds(
        Array.from(retiredContractAgreementsToSave.keys()),
      );
    } catch (error) {
      enqueueSnackbar(translator("contractAgreements.retiredFetchError"), {
        variant: "error",
        content: (key: SnackbarKey) => (
          <Snackbar
            type="error"
            message={translator("contractAgreements.retiredFetchError")}
            content={"Failed to Fetch Retired Agreements"}
            onClose={() => {
              closeSnackbar(key);
            }}
          />
        ),
      });
    } finally {
      setLoading(false);
    }
  }, [edcClient, translator]);

  useEffect(() => {
    populateRetired();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [populateRetired]);

  return {
    retiredContractAgreementIds,
    contractAgreementInfo,
    rePopulateRetired: populateRetired,
    loading,
  };
};
