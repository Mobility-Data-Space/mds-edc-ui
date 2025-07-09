import React, {useRef, useState} from "react";
import {enqueueSnackbar} from "notistack";
import {Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {ContractAgreement, DataAddress} from "@think-it-labs/edc-connector-client";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";
import {Input} from "@/components/atoms/input";
import {MuiSelect} from "@/components/atoms/mui-select";
import {T} from "@/i18n";
import { DATA_ADDRESS_SELECT_DATA } from "@/constants/data-address-types";
import {theme} from "@/theme/ThemeProvider";
import {useParticipantConnectorState} from "@/hooks/use-participant-connector-state";
import {removeJsonLdSchemaFromProperties} from "@/utilities/catalog";
import {DataAddressTypes, defaultHttpDestinationDataAddress} from "@/utilities/data-address";
import {createTransferProcessRequest} from "@/utilities/transfer-process";
import {AssetContactEmailAndSubject} from "@/components/molecules/asset-contact-email-and-subject.tsx";
import {AssetFormDataAddressAmazonS3} from "@/components/organisms/asset-form-data-address-amazon-s3.tsx";
import {AssetFormDataAddressStep} from "@/components/organisms/asset-form-data-address-step.tsx";
import {validateDataAddress} from "@/utilities/asset.ts";

export interface TransferFormDialogProps {
  open: boolean,
  onClose: () => void,
  onSuccess?: () => void,
  translator: (key: string) => string,
  contractAgreementLd: ContractAgreement,
}

export function TransferFormDialog({ contractAgreementLd, open, onClose, onSuccess = () => {}, translator }: TransferFormDialogProps): JSX.Element {
  const [formData, setFormData] = useState<DataAddress>(defaultHttpDestinationDataAddress);

  const [errors, setErrors] = useState({});
  const contractAgreement = removeJsonLdSchemaFromProperties(contractAgreementLd);
  const { connector } = useParticipantConnectorState();
  const edcClient = useEdcConnectorClient({management: connector.managementUrl});
  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = () => {
    const agreement: Partial<ContractAgreement> = {
      assetId: contractAgreement?.assetId[0] && contractAgreement?.assetId[0]["@value"],
      providerId: contractAgreement?.providerId[0] && contractAgreement?.providerId[0]["@value"],
      consumerId: contractAgreement?.consumerId[0] && contractAgreement?.consumerId[0]["@value"],
      contractId: contractAgreement["@id"],
    };
    const transfer = createTransferProcessRequest(agreement as ContractAgreement, DataAddressTypes.HttpData, formData, connector.protocolUrl);
    edcClient.management.transferProcesses.initiate(transfer)
      .then(() => {
        enqueueSnackbar(translator("transferProcesses.new.success"));
        onSuccess();
        onClose();
      })
      .catch(error => {
        const match = /"message":"(.*?)"/.exec(error.message)
        enqueueSnackbar((match && match[1]) || translator("common.errorOccurred"));
      })
  }

  const onChange = (newFormData: DataAddress) => {
    setErrors(validateDataAddress(newFormData, translator, true));
    setFormData(newFormData);
  }

  return (
    <Dialog
      open={open}
      maxWidth="lg"
      className="my-7"
      onClose={onClose}
    >
      <DialogTitle>
        <Typography variant="h4">
          <T string="transferProcesses.new.initiateTransfer" />
        </Typography>
      </DialogTitle>
      <DialogContent style={{ maxWidth: "80vw", width: "800px" }}>
        <form
          ref={formRef}
          onSubmit={(event) => {
            event.preventDefault();
            return onSubmit();
          }}
        >
          <AssetFormDataAddressStep
            translator={translator}
            formData={formData}
            onChange={onChange}
            errors={errors}
            isDestination
          />
        </form>
      </DialogContent>
      <DialogActions>
        <div className="flex justify-end flex-grow gap-x-3 p-3">
          <Button color="secondary" onClick={onClose}>
            <T string="common.close"/>
          </Button>
          <Button color="primary" variant="contained" onClick={() => formRef.current && formRef.current.requestSubmit()}>
            <T string="transferProcesses.new.initiateTransfer"/>
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
