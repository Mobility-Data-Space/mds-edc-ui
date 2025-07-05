import { TitleWithIcon } from "@/components/atoms/TitleWithIcon";
import ContractNegotiationDetails from "@/components/organisms/contract-negotiation-details";
import { T } from "@/i18n";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { ContractNegotiation } from "@think-it-labs/edc-connector-client";

interface ContractNegotiationDialogProps {
  contractNegotiation: ContractNegotiation;
  open: boolean;
  onClose: () => void;
  participantId: string;
  contentStyle?: { [key: string]: string };
  translator: (key: string) => string;

}
export default function ContractNegotiationDialog({ open, onClose, contractNegotiation, participantId, contentStyle = {}, translator }: ContractNegotiationDialogProps) {

  return (
    <>
      <Dialog
        open={open}
        maxWidth="lg"
        id="negotiation-details"
        className="my-7"
        onClose={onClose}
      >
        <DialogTitle>
          <TitleWithIcon title={contractNegotiation.assetId} subtitle={participantId} />
        </DialogTitle>
        <DialogContent style={contentStyle}>
          <ContractNegotiationDetails contractNegotiation={contractNegotiation} />
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            <T string="common.close" />
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
