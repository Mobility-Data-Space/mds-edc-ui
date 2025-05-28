import React, {useState} from "react";
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
import { DataAddressTypes, defaultHttpDataAddress } from "@/utilities/data-address.ts";
import {createTransferProcessRequest} from "@/utilities/transfer-process";

export interface TransferFormDialogProps {
  isOpen: boolean,
  onClose: () => void,
  translator: (key: string) => string,
  contractAgreementLd: ContractAgreement,
}

export function TransferFormDialog({ contractAgreementLd, isOpen, onClose, translator }: TransferFormDialogProps): JSX.Element {
  const [formData, setFormData] = useState<DataAddress>(defaultHttpDataAddress);

  const [errors, setErrors] = useState<DataAddress>({} as DataAddress);
  const contractAgreement = removeJsonLdSchemaFromProperties(contractAgreementLd);
  const { connector } = useParticipantConnectorState();
  const edcClient = useEdcConnectorClient({management: connector.managementUrl}) ;

  const onSubmit = () => {
    const agreement: Partial<ContractAgreement> = {
      assetId: contractAgreement?.assetId[0] && contractAgreement?.assetId[0]["@value"],
      providerId: contractAgreement?.providerId[0] && contractAgreement?.providerId[0]["@value"],
      consumerId: contractAgreement?.consumerId[0] && contractAgreement?.consumerId[0]["@value"],
      contractId: contractAgreement["@id"],
    };
    const transfer = createTransferProcessRequest(agreement as ContractAgreement, DataAddressTypes.HttpData, formData, connector.protocolUrl);
    edcClient.management.transferProcesses.initiate(transfer)
      .then(onClose)
      .catch(error => enqueueSnackbar(translator("common.errorOccurred")))
  }

  return (
    <Dialog
      open={isOpen}
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
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-5 items-start">
            <label
              htmlFor="data-address-type"
              className="inline-block text-sm text-black font-medium mb-2"
            >
              <T string="assets.new.fieldDataAddressType"/>
            </label>
            <MuiSelect
              name="data-address-type"
              id="data-address-type"
              label={translator("assets.new.fieldDataAddressType")}
              options={DATA_ADDRESS_SELECT_DATA}
              error={errors["TRANSFER_PROCESS_DATA_ADDRESS_TYPE"]}
              value={formData.type}
              onChange={(event) => setFormData({...formData, type: event.target.value})}
            />
          </div>

          {formData.type == DataAddressTypes.CustomJson &&
            <Input
              name="properties-description"
              id="properties-description"
              key="properties-description"
              multiline
              rows={2}
              label={DATA_ADDRESS_SELECT_DATA.find(option => option.value === formData.type)?.text}
              placeholder={'{}'}
              required
              helperText={typeof errors["TRANSFER_PROCESS_DATA_DESTINATION"] === "string" ? errors["TRANSFER_PROCESS_DATA_DESTINATION"] : ""}
              classes={{textField: {'& p': {color: theme.palette.error.main}}} as any}
              error={errors["TRANSFER_PROCESS_DATA_DESTINATION"]}
              value={formData.description}
              onChange={(event) => setFormData({...formData, description: event.target.value})}
            />
          }
          {formData.type === DataAddressTypes.HttpData &&
            <>
              <div className="flex gap-x-3">
                <MuiSelect
                  name="data-address-method"
                  id="data-address-method"
                  label={translator("assets.new.fieldDataAddressMethod")}
                  options={[
                    {value: "POST"},
                    {value: "PUT"},
                    {value: "PATCH"},
                    {value: "DELETE"},
                    {value: "OPTIONS"},
                  ]}
                  error={errors["TRANSFER_PROCESS_HTTP_METHOD"]}
                  value={formData.method}
                  onChange={(event) => setFormData({...formData, method: event.target.value})}
                />
                <Input
                  name="data-address-base-url"
                  id="data-address-base-url"
                  data-testid="data-address-base-url"
                  type="url"
                  required
                  placeholder={"https://"}
                  label={translator("assets.new.fieldDataAddressUrl")}
                  error={errors["TRANSFER_PROCESS_HTTP_URL"]}
                  value={formData.baseUrl}
                  onChange={(event) => setFormData({...formData, baseUrl: event.target.value})}
                />
              </div>
            </>
          }
        </div>
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          <T string="common.close"/>
        </Button>
        <Button color="primary" variant="contained" onClick={onSubmit}>
          <T string="transferProcesses.new.initiateTransfer"/>
        </Button>
      </DialogActions>
    </Dialog>
  );
}
