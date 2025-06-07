import React, {useEffect, useState} from "react";
import { T } from "@/i18n";
import {Asset, ContractAgreement, Dataset, TransferProcessStates} from "@think-it-labs/edc-connector-client";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, LinearProgress} from "@mui/material";
import {TitleWithIcon} from "@/components/atoms/TitleWithIcon";
import {TransferFormDialog} from "@/components/templates/transfer-form-dialog";
import ContractAgreementDetails from "@/components/organisms/contract-agreement-details";
import ContractAgreementTerminateDialog from "@/components/organisms/contract-agreement-terminate-dialog";
import {useEdcConnectorClient} from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";
import {enqueueSnackbar} from "notistack";
import {TransferProcess} from "@think-it-labs/edc-connector-client/dist/src/entities";
import {TERMINATION_REASON_BY_USER} from "@/constants/contract-agreement.ts";
import Typography from "@mui/material/Typography";
import {datasetToAsset, removeJsonLdSchemaFromProperties} from "@/utilities/catalog";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld";
import {Timestamp} from "@think-it-labs/edc-connector-ui/timestamp";

interface ContractAgreementDialogProps {
  contractAgreement: ContractAgreement;
  open: boolean;
  onClose: () => void;
  participantId: string;
  managementUrl: string;
  connectorEndpoint: string;
  contentStyle?: { [key: string]: string };
  translator: (key: string) => string;
  retirementReason?: string;
  isTerminated?: boolean;
  isRunning?: boolean;
  isTerminatedAt?: number;
}

export default function ContractAgreementDialog({ open, onClose, contractAgreement, participantId, managementUrl, connectorEndpoint, contentStyle = {}, translator, retirementReason = "", isTerminated = false, isRunning = false, isTerminatedAt = 0 }: ContractAgreementDialogProps) {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isTerminateModalOpen, setIsTerminateModalOpen] = useState(false);

  const [asset, setAsset] = useState({} as Asset);
  const [transferProcesses, setTransferProcesses] = useState<TransferProcess[]>([]);
  const [counterPartyAddress, setCounterPartyAddress] = useState(connectorEndpoint);

  const edcClient = useEdcConnectorClient({ management: managementUrl });
  useEffect(() => {
    if (! contractAgreement.assetId) {
      return;
    }

    if (contractAgreement.providerId === participantId) {
      edcClient.management.assets.get(contractAgreement.assetId)
      .then((fetchedAsset) => {
        setAsset(fetchedAsset);
        setCounterPartyAddress(connectorEndpoint);
      })
      .catch(error => enqueueSnackbar(translator('assets.[id].fetchError')))
    } else {
      edcClient.management.contractAgreements.getNegotiation(contractAgreement.id)
        .then(negotiation => {
          const providerCounterPartyAddress = readValue(removeJsonLdSchemaFromProperties(negotiation), "counterPartyAddress");
          setCounterPartyAddress(providerCounterPartyAddress);
          edcClient.management.catalog.request({ counterPartyAddress: providerCounterPartyAddress })
            .then(catalog => setAsset(
              datasetToAsset(
                catalog.datasets.find(
                  dataset => dataset.id === contractAgreement.assetId
                ) || {} as Dataset
              )
            ));
        });
    }
  }, [edcClient, contractAgreement.assetId]);

  useEffect(() => {
    if (! contractAgreement.id) {
      return;
    }
    edcClient.management.transferProcesses.queryAll({
      filterExpression: [{
        "operandLeft": "contractId",
        "operator": "=",
        "operandRight": contractAgreement.id
      }]
    }).then(setTransferProcesses);
  }, [edcClient, contractAgreement.id]);

  return (
    <>
      <TransferFormDialog
        contractAgreementLd={contractAgreement}
        open={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        translator={translator}
      />
      <ContractAgreementTerminateDialog
        contractAgreement={contractAgreement}
        open={isTerminateModalOpen}
        onClose={() => setIsTerminateModalOpen(false)}
        translator={translator}
      />
      <Dialog
        open={open}
        maxWidth="lg"
        className="my-7"
        onClose={onClose}
      >
        <DialogTitle>
          <TitleWithIcon
            icon={<Icon fontSize="large" color={isTerminated ? "error" : "inherit"}>
              {
                (contractAgreement.consumerId === participantId ? "file_download" : "file_upload") +
                (isTerminated ? "_off" : "")
              }
            </Icon>}
            title={contractAgreement.assetId}
            subtitle={participantId}
          />
        </DialogTitle>
        <DialogContent style={contentStyle}>
          <div className="flex flex-col gapy-y-3">
            {isRunning && <LinearProgress className="my-3" />}

            {isTerminated &&
              <div className="flex gap-x-3 p-4 mb-3 rounded bg-red-50">
                <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" className="h-5 w-5 mt-1 text-red-400">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                </svg>
                <div>
                  <Typography variant="subtitle1" className="text-red-800">
                    {TERMINATION_REASON_BY_USER}
                  </Typography>
                  <Typography variant="body2" className="text-red-800">
                    {retirementReason}
                  </Typography>
                  <Typography variant="body2" className="text-red-800">
                    <Timestamp seconds={isTerminatedAt} year="numeric" month="2-digit" day="2-digit" hour="numeric" minute="numeric" />
                  </Typography>
                </div>
              </div>
            }

            <ContractAgreementDetails
              contractAgreement={contractAgreement}
              participantId={participantId}
              asset={asset}
              transferProcesses={transferProcesses}
              counterPartyAddress={counterPartyAddress}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <div className="flex justify-between flex-grow p-3">
            {!isTerminated && <Button
              data-testid="transfer-process-terminate"
              variant="contained"
              color="error"
              onClick={() => setIsTerminateModalOpen(true)}
            >
              <T string="common.terminate"/>
            </Button>}
            <div className="flex flex-grow justify-end gap-x-3">
              <Button color="secondary" onClick={onClose} className="self-end">
                <T string="common.close"/>
              </Button>
              {!isTerminated && <Button
                data-testid="transfer-process-submit"
                variant="contained"
                onClick={() => setIsTransferModalOpen(true)}
              >
                <T string="common.transfer"/>
              </Button>}
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}
