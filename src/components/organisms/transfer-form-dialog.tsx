import { FormDataAddressStep } from "@/components/organisms/form-data-address-step";
import { proxyConnectorManagement } from "@/constants/proxy";
import { T } from "@/i18n";
import { validateDataAddress } from "@/domain/asset/validation";
import { removeJsonLdSchemaFromProperties } from "@/utilities/catalog";
import { defaultHttpDestinationDataAddress } from "@/utilities/data-address";
import { createTransferProcessRequest } from "@/utilities/transfer-process";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {
  ContractAgreement,
  DataAddress,
} from "@think-it-labs/edc-connector-client";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/use-edc-connector";
import { useCallback, useRef, useState } from "react";
import { useAppSnackbar } from "@/hooks/use-app-snackbar";
import { extractEdcErrorMessage } from "@/utilities/edc-error";

export interface TransferFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  translator: (key: string) => string;
  contractAgreementId: ContractAgreement;
  counterPartyAddress: string;
}

export function TransferFormDialog({
  contractAgreementId,
  open,
  onClose,
  onSuccess = () => { },
  translator,
  counterPartyAddress,
}: TransferFormDialogProps): React.ReactElement {
  const [formData, setFormData] = useState<DataAddress>(
    defaultHttpDestinationDataAddress,
  );


  const [errors, setErrors] = useState({});
  const { showSnackbar } = useAppSnackbar();
  const contractAgreement =
    removeJsonLdSchemaFromProperties(contractAgreementId);
  const edcClient = useEdcConnectorClient({
    management: proxyConnectorManagement,
  });
  const formRef = useRef<HTMLFormElement>(null);

  const handleClose = useCallback(()=> {
    setFormData(defaultHttpDestinationDataAddress);
    onClose();
  }, [onClose])
  const onSubmit = () => {
    const agreement: Partial<ContractAgreement> = {
      contractId: contractAgreement["@id"],
    };
    const transfer = createTransferProcessRequest(
      agreement as ContractAgreement,
      formData,
      counterPartyAddress,
    );
    edcClient.management.transferProcesses
      .initiate(transfer)
      .then(() => {
        showSnackbar({
          type: "success",
          message: translator("transferProcesses.new.success"),
          persist: false,
        });
        onSuccess();
        onClose();
      })
      .catch((error) => {
        showSnackbar({
          type: "error",
          message:
            extractEdcErrorMessage(error) || translator("common.errorOccurred"),
          persist: false,
        });
      });
  };

  const onChange = (newFormData: DataAddress) => {
    setErrors(validateDataAddress(newFormData, translator));
    setFormData(newFormData);
  };

  return (
    <Dialog open={open} maxWidth="lg" className="my-7" onClose={handleClose}>
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
          <FormDataAddressStep
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
          <Button color="secondary" onClick={handleClose}>
            <T string="common.close" />
          </Button>
          <Button
            color="primary"
            variant="contained"
            onClick={() => formRef.current && formRef.current.requestSubmit()}
          >
            <T string="transferProcesses.new.initiateTransfer" />
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
