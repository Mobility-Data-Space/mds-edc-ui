import React, {useState} from "react";
import { T } from "@/i18n";
import {ContractAgreement} from "@think-it-labs/edc-connector-client";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, IconButton} from "@mui/material";
import {TitleWithIcon} from "@/components/atoms/TitleWithIcon.tsx";
import {TransferFormDialog} from "@/components/templates/transfer-form-dialog.tsx";
import ContractAgreementDetails from "@/components/organisms/contract-agreement-details.tsx";

interface ContractAgreementDialogProps {
  contractAgreement: ContractAgreement;
  open: boolean;
  onClose: () => void;
  participantId: string;
  managementUrl: string;
  contentStyle?: { [key: string]: string };
  translator: (key: string) => string;

}
export default function ContractAgreementDialog({ open, onClose, contractAgreement, participantId, managementUrl, contentStyle = {}, translator }: ContractAgreementDialogProps) {
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const icon = <Icon fontSize="large">{contractAgreement.providerId === participantId ? "file_upload" : "file_download"}</Icon>;

  return (
    <>
      <TransferFormDialog
        contractAgreementLd={contractAgreement}
        isOpen={isTransferModalOpen}
        onClose={() => setIsTransferModalOpen(false)}
        translator={translator}
      />
      <Dialog
        open={open}
        maxWidth="lg"
        className="my-7"
        onClose={onClose}
      >
        <DialogTitle>
          <TitleWithIcon icon={icon} title={contractAgreement.assetId} subtitle={participantId} />
        </DialogTitle>
        <DialogContent style={contentStyle}>
          <ContractAgreementDetails contractAgreement={contractAgreement} participantId={participantId} managementUrl={managementUrl} />
        </DialogContent>
        <DialogActions>
          <Button
            data-testid="transfer-process-terminate"
            variant="contained"
            onClick={() => ""}
          >
            <T string="common.terminate"/>
          </Button>
          <Button color="secondary" onClick={onClose}>
            <T string="common.close"/>
          </Button>
          <Button
            data-testid="transfer-process-submit"
            variant="contained"
            onClick={() => setIsTransferModalOpen(true)}
          >
            <T string="common.transfer"/>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
