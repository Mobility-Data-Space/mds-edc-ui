import React, {useState} from "react";
import { T } from "@/i18n";
import {ContractNegotiation} from "@think-it-labs/edc-connector-client";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Icon, IconButton} from "@mui/material";
import {TitleWithIcon} from "@/components/atoms/TitleWithIcon.tsx";
import ContractNegotiationDetails from "@/components/organisms/contract-negotiation-details.tsx";

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
            <T string="common.close"/>
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
