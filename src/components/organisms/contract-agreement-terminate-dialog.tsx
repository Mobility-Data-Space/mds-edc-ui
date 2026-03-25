import { useState } from "react";
import { T } from "@/i18n";
import {
  ContractAgreement,
  EdcConnectorClient,
} from "@think-it-labs/edc-connector-client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { Input } from "@/components/atoms/input";
import {
  TERMINATION_DETAILED_REASON_MAX_LENGTH,
  TERMINATION_REASON_BY_USER,
} from "@/constants/contract-agreement.ts";
import { Checkbox } from "@/components/atoms/checkbox";
import { AgreementsRetirementController } from "@/utilities/contract-agreement";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useAppSnackbar } from "@/hooks/use-app-snackbar";

interface ContractAgreementTerminateDialogProps {
  contractAgreement: ContractAgreement;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  translator: (key: string) => string;
}

function calculateDetailedReasonValidationError(
  detailedReason: string,
  translator: (key: string) => string,
) {
  if (!detailedReason) {
    return translator("contractAgreements.[id].detailedReasonRequiredError");
  }

  if (detailedReason.length > TERMINATION_DETAILED_REASON_MAX_LENGTH) {
    return translator("contractAgreements.[id].detailedReasonMaxLengthError");
  }

  return false;
}

const client = new EdcConnectorClient.Builder()
  .managementUrl(proxyConnectorManagement)
  .use("retirement", AgreementsRetirementController)
  .build();

export default function ContractAgreementTerminateDialog({
  contractAgreement,
  open,
  onClose,
  onSuccess = () => { },
  translator,
}: ContractAgreementTerminateDialogProps) {
  const { showSnackbar } = useAppSnackbar();
  const [formData, setFormData] = useState({
    reason: TERMINATION_REASON_BY_USER,
    detailedReason: "",
    confirmTermination: false,
  });

  const detailedReasonError = calculateDetailedReasonValidationError(
    formData.detailedReason,
    translator,
  );
  const charactersCount =
    !detailedReasonError &&
    `${formData.detailedReason.length}/${TERMINATION_DETAILED_REASON_MAX_LENGTH} characters`;

  const onClick = () => {
    client.retirement
      .retire(contractAgreement.id, formData.detailedReason)
      .then(() => {
        onSuccess();
        onClose();
      })
      .catch((error) => {
        const match = /"message":"(.*?)"/.exec(error.message);
        showSnackbar({
          type: "error",
          message:
            (match && match[1]) ||
            translator("contractAgreements.[id].terminationError"),
        });
      });
  };

  return (
    <Dialog
      open={open}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "800px",
          },
        },
      }}
      className="my-7"
      onClose={onClose}
    >
      <DialogTitle>
        <Typography variant="h5">
          <T string="contractAgreements.[id].terminateContractAgreementTitle" />
        </Typography>
      </DialogTitle>
      <DialogContent>
        <div className="flex flex-col gap-y-5">
          <div>
            <Typography variant="body2">
              <T string="contractAgreements.[id].terminateContractAgreementDescription" />
            </Typography>
            <Typography variant="body2">
              <T string="contractAgreements.[id].actionIrreversible" />
            </Typography>
          </div>

          <Typography variant="h6" className="!font-normal">
            <T string="contractAgreements.[id].terminateContractAgreementDetails" />
          </Typography>

          <Input
            name="reasonTitle"
            id="contract-agreement-terminationreason"
            data-testid="contract-agreement-terminationreason"
            label={translator("contractAgreements.[id].reason")}
            value={TERMINATION_REASON_BY_USER}
            disabled
          />
          <div className="flex flex-col">
            <Input
              name="reason"
              id="properties-description"
              placeholder={translator(
                "contractAgreements.[id].detailedReasonPlaceholder",
              )}
              multiline
              required
              rows={6}
              label={translator("contractAgreements.[id].detailedReason")}
              value={formData.detailedReason}
              error={detailedReasonError}
              onChange={(event) =>
                setFormData({ ...formData, detailedReason: event.target.value })
              }
            />
            <FormHelperText className="self-end">
              {charactersCount}
            </FormHelperText>
          </div>

          <Checkbox
            label={translator("contractAgreements.[id].confirmTermination")}
            value={formData.confirmTermination}
            onChange={(event) =>
              setFormData({
                ...formData,
                confirmTermination: event.target.checked,
              })
            }
          />
        </div>
      </DialogContent>
      <DialogActions>
        <div className="p-3">
          <Button color="secondary" onClick={onClose} sx={{ px: 4 }}>
            <T string="common.close" />
          </Button>
          <Button
            data-testid="transfer-process-submit"
            variant="contained"
            color="error"
            disabled={!formData.confirmTermination || !!detailedReasonError}
            onClick={onClick}
          >
            <T string="common.terminate" />
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
