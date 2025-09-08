import { STATE_RUNNING } from "@/constants/transfer-process";
import { AGREEMENT_RETIREMENT_DATE, AGREEMENT_RETIREMENT_REASON, AgreementsRetirementController } from "@/utilities/contract-agreement";
import { EdcConnectorClient, TransferProcessStates } from "@think-it-labs/edc-connector-client";
import { NextRequest, NextResponse } from "next/server";

// TODO: to be moved
function connectorApiKey() {
  return process.env.EDC_MANAGEMENT_API_KEY || "";
}

function connectorManagmentUrl() {
  return process.env.EDC_MANAGEMENT_URL || "";
}

const client = new EdcConnectorClient.Builder()
  .apiToken(connectorApiKey())
  .managementUrl(connectorManagmentUrl())
  .use("retiredAgreements", AgreementsRetirementController)
  .build()

const handlePost = async (req: NextRequest): Promise<NextResponse> => {
  const body = await req.json()

  const retiredAgreements = await client.retiredAgreements.retiredAgreementsRequest();

  const retiredContractAgreementsToSave = new Map(
    retiredAgreements.map(retiredAgreement => [retiredAgreement.agreementId, retiredAgreement] as const)
  );

  const transferProcesses = await client.management.transferProcesses.queryAll({ offset: 0 });

  const contractAgreementInfoToSave = new Map<string, ContractAgreementInfo>();

  transferProcesses.forEach(transferProcess => {
    const contractAgreementId = transferProcess.contractId;
    const contractAgreement = contractAgreementInfoToSave.get(contractAgreementId);

    if (contractAgreement) {
      contractAgreement.transfersCount++;

      if (contractAgreement.isRunning !== true) {
        contractAgreement.isRunning = transferProcess.state === STATE_RUNNING;
      }
    } else {
      const retiredContractAgreement = retiredContractAgreementsToSave.get(contractAgreementId);

      if (retiredContractAgreement) {
        contractAgreementInfoToSave.set(contractAgreementId, {
          isTerminated: retiredContractAgreementsToSave.has(contractAgreementId),
          isRunning:
            transferProcess.state !== TransferProcessStates.TERMINATED &&
            transferProcess.state === STATE_RUNNING,
          isTerminatedAt: retiredContractAgreement[AGREEMENT_RETIREMENT_DATE] as number,
          retirementReason: retiredContractAgreement[AGREEMENT_RETIREMENT_REASON] as string,
          transfersCount: 1,
        });
      }
    }
  });

  const contractAgreementInfo = Object.fromEntries(contractAgreementInfoToSave)
  const retiredContractAgreementIds = Array.from(retiredContractAgreementsToSave.keys())

  const contractAgreements = await client.management.contractAgreements.queryAll(body)

  return new NextResponse(JSON.stringify(contractAgreements), { status: 200 })
};


export const POST = handlePost;
