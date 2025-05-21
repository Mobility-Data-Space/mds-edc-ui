import React, {useState} from "react";
import {Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText} from "@mui/material";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {MuiSelect} from "../atoms/mui-select.tsx";
import {DATA_ADDRESS_TYPE_DATASINK, DATA_ADDRESS_TYPE_HTTP, DATA_ADDRESS_TYPE_TRANSFER_PROCESS, DATA_TRANSFER_TYPE
} from "@/constants/data-address-types.ts";
import {RadioButton} from "@/components/atoms/radio-button.tsx";
import {KeyValuePairInputList} from "@/components/molecules/key-value-pair-input-list.tsx";
import {ASSET_DATA_ADDRESS_ENABLE_QUERY_PARAMETERIZATION, ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_SELECT_OPTIONS,ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VAULT_SECRET} from "@/schema/asset.ts";
import {theme} from "@/theme/ThemeProvider.tsx";
import Typography from "@mui/material/Typography";
import {TRANSFER_PROCESS_DATA_ADDRESS_TYPE, TRANSFER_PROCESS_DATA_DESTINATION, TRANSFER_PROCESS_HTTP_AUTH_HEADER_NAME, TRANSFER_PROCESS_HTTP_AUTH_HEADER_TYPE, TRANSFER_PROCESS_HTTP_AUTH_HEADER_VALUE, TRANSFER_PROCESS_HTTP_HEADERS, TRANSFER_PROCESS_HTTP_METHOD, TRANSFER_PROCESS_HTTP_PROXIED_BODY, TRANSFER_PROCESS_HTTP_PROXIED_BODY_CONTENT_TYPE, TRANSFER_PROCESS_HTTP_PROXIED_METHOD, TRANSFER_PROCESS_HTTP_PROXIED_PATH, TRANSFER_PROCESS_HTTP_PROXIED_QUERY_PARAMS, TRANSFER_PROCESS_HTTP_SHOW_AUTH_HEADER, TRANSFER_PROCESS_HTTP_URL, TRANSFER_PROCESS_SHOW_ALL_HTTP_PARAMETERIZATION_FIELDS} from "@/schema/transfer-process.ts";
import {ContractAgreement, DataAddress, PolicyBuilder} from "@think-it-labs/edc-connector-client";
import {ContractAgreementView} from "@think-it-labs/edc-connector-ui/contract-agreement-view.tsx";
import {createTransferProcessRequest, defaultDataDestination} from "@/utilities/transfer-process.ts";
import Button from "@mui/material/Button";
import {useParticipantConnectorState} from "@/hooks/use-participant-connector-state";
import {enqueueSnackbar} from "notistack";
import {removeJsonLdSchemaFromProperties} from "@/utilities/catalog.ts";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client.ts";

export interface TransferFormDialogProps {
  isOpen: boolean,
  onClose: () => void,
  translator: (key: string) => string,
}

export function TransferFormDialog({ isOpen, onClose, translator }: TransferFormDialogProps): JSX.Element {
  const [formData, setFormData] = useState<DataAddress>(defaultDataDestination);

  const [errors, setErrors] = useState<any>({});
  const contractAgreement = removeJsonLdSchemaFromProperties(ContractAgreementView.Item());
  
  const { connector } = useParticipantConnectorState();
  const edcClient = useEdcConnectorClient({management: connector.managementUrl}) ;

  const onSubmit = () => {
    const agreement: Partial<ContractAgreement> = {
      assetId: contractAgreement?.assetId[0] && contractAgreement?.assetId[0]["@value"],
      providerId: contractAgreement?.providerId[0] && contractAgreement?.providerId[0]["@value"],
      consumerId: contractAgreement?.consumerId[0] && contractAgreement?.consumerId[0]["@value"],
      contractId: contractAgreement["@id"],
    };
    const transfer = createTransferProcessRequest(agreement as ContractAgreement, "HttpData-PULL", formData, connector.protocolUrl);
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
              name={TRANSFER_PROCESS_DATA_ADDRESS_TYPE}
              id="data-address-type"
              label={translator("assets.new.fieldDataAddressType")}
              options={DATA_TRANSFER_TYPE}
              error={errors[TRANSFER_PROCESS_DATA_ADDRESS_TYPE]}
              value={formData[TRANSFER_PROCESS_DATA_ADDRESS_TYPE]}
              onChange={(event) => setFormData({...formData, [TRANSFER_PROCESS_DATA_ADDRESS_TYPE]: event.target.value})}
            />
          </div>

          {[DATA_ADDRESS_TYPE_DATASINK.value, DATA_ADDRESS_TYPE_TRANSFER_PROCESS.value].includes(formData[TRANSFER_PROCESS_DATA_ADDRESS_TYPE]) &&
            <Input
              name={TRANSFER_PROCESS_DATA_DESTINATION}
              id="properties-description"
              key="properties-description"
              multiline
              rows={2}
              label={DATA_TRANSFER_TYPE.find(option => option.value === formData[TRANSFER_PROCESS_DATA_ADDRESS_TYPE])?.text}
              placeholder={'{}'}
              required
              helperText={typeof errors[TRANSFER_PROCESS_DATA_DESTINATION] === "string" ? errors[TRANSFER_PROCESS_DATA_DESTINATION] : ""}
              classes={{textField: {'& p': {color: theme.palette.error.main}}} as any}
              error={errors[TRANSFER_PROCESS_DATA_DESTINATION]}
              value={formData[TRANSFER_PROCESS_DATA_DESTINATION]}
              onChange={(event) => setFormData({...formData, [TRANSFER_PROCESS_DATA_DESTINATION]: event.target.value})}
            />
          }
          {formData[TRANSFER_PROCESS_DATA_ADDRESS_TYPE] === DATA_ADDRESS_TYPE_HTTP.value &&
            <>
              <div className="flex gap-x-3">
                <MuiSelect
                  name={TRANSFER_PROCESS_HTTP_METHOD}
                  id="data-address-method"
                  label={translator("assets.new.fieldDataAddressMethod")}
                  options={[
                    {value: "POST"},
                    {value: "PUT"},
                    {value: "PATCH"},
                    {value: "DELETE"},
                    {value: "OPTIONS"},
                  ]}
                  error={errors[TRANSFER_PROCESS_HTTP_METHOD]}
                  value={formData[TRANSFER_PROCESS_HTTP_METHOD]}
                  onChange={(event) => setFormData({...formData, [TRANSFER_PROCESS_HTTP_METHOD]: event.target.value})}
                />
                <Input
                  name={TRANSFER_PROCESS_HTTP_URL}
                  id="data-address-base-url"
                  data-testid="data-address-base-url"
                  type="url"
                  required
                  placeholder={"https://"}
                  label={translator("assets.new.fieldDataAddressUrl")}
                  error={errors[TRANSFER_PROCESS_HTTP_URL]}
                  value={formData[TRANSFER_PROCESS_HTTP_URL]}
                  onChange={(event) => setFormData({...formData, [TRANSFER_PROCESS_HTTP_URL]: event.target.value})}
                />
              </div>

              <div className="flex flex-col gap-y-5 items-start">
                <label
                  htmlFor="data-address-base-url"
                  className="inline-block text-sm text-gray-800 mt-2.5"
                >
                  <T string="assets.new.fieldDataAddressHeaderAuth"/>
                </label>
                {formData[TRANSFER_PROCESS_HTTP_SHOW_AUTH_HEADER] && <>
                  <MuiSelect
                    name={TRANSFER_PROCESS_HTTP_AUTH_HEADER_TYPE}
                    label={translator("assets.new.fieldDataAddressType")}
                    options={ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_SELECT_OPTIONS.map(option => ({
                      value: option.value,
                      text: translator(option.text)
                    }))}
                    error={errors[TRANSFER_PROCESS_HTTP_AUTH_HEADER_TYPE]}
                    value={formData[TRANSFER_PROCESS_HTTP_AUTH_HEADER_TYPE]}
                    onChange={(event) => setFormData({
                      ...formData,
                      [TRANSFER_PROCESS_HTTP_AUTH_HEADER_TYPE]: event.target.value
                    })}
                  />

                  <div className="grid sm:grid-cols-3 gap-2 w-full">
                    <Input
                      className="sm:col-span-1"
                      name={TRANSFER_PROCESS_HTTP_AUTH_HEADER_NAME}
                      id="properties-publisher"
                      type="text"
                      label={<T string="assets.new.fieldDataAddressAuthHeaderName"/>}
                      placeholder={translator("assets.new.fieldDataAddressAuthHeaderNamePlaceholder")}
                      value={formData[TRANSFER_PROCESS_HTTP_AUTH_HEADER_NAME]}
                      error={errors[TRANSFER_PROCESS_HTTP_AUTH_HEADER_NAME]}
                      onChange={(event) => setFormData({
                        ...formData,
                        [TRANSFER_PROCESS_HTTP_AUTH_HEADER_NAME]: event.target.value
                      })}
                    />

                    <Input
                      className="sm:col-span-2"
                      name={TRANSFER_PROCESS_HTTP_AUTH_HEADER_VALUE}
                      id="properties-standard-license"
                      type="text"
                      label={<T
                        string={formData[TRANSFER_PROCESS_HTTP_AUTH_HEADER_TYPE] === ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VAULT_SECRET ? "assets.new.fieldDataAddressAuthHeaderVaultValue" : "assets.new.fieldDataAddressAuthHeaderValue"}/>}
                      placeholder={formData[TRANSFER_PROCESS_HTTP_AUTH_HEADER_TYPE] === ASSET_DATA_ADDRESS_HTTP_AUTH_HEADER_TYPE_VAULT_SECRET ? "Mysecret123" : "Bearer ..."}
                      value={formData[TRANSFER_PROCESS_HTTP_AUTH_HEADER_VALUE]}
                      error={errors[TRANSFER_PROCESS_HTTP_AUTH_HEADER_VALUE]}
                      onChange={(event) => setFormData({
                        ...formData,
                        [TRANSFER_PROCESS_HTTP_AUTH_HEADER_VALUE]: event.target.value
                      })}
                    />
                  </div>
                </>}

                <RadioButton
                  id="data-address-enable-body-parameterization"
                  labelTrue={translator("assets.new.fieldDataAddressHeaderTypeTrue")}
                  labelFalse={translator("assets.new.fieldDataAddressHeaderTypeFalse")}
                  value={formData[TRANSFER_PROCESS_HTTP_SHOW_AUTH_HEADER]}
                  onChange={(value) => setFormData({...formData, [TRANSFER_PROCESS_HTTP_SHOW_AUTH_HEADER]: value})}
                />
              </div>


              <div className="flex flex-col gap-y-5 items-start">
                <label
                  htmlFor="data-address-query-params"
                  className="inline-block text-sm text-gray-800 mt-2.5"
                >
                  <T string="assets.new.fieldDataAddressHttpHeaders"/>
                </label>
                <KeyValuePairInputList
                  label={translator("assets.new.fieldDataAddressHttpHeaders")}
                  addText={translator("assets.new.fieldDataAddressHttpHeadersAddText")}
                  keyLabel={translator("assets.new.fieldDataAddressHttpHeaderName")}
                  keyPlaceholder={translator("assets.new.fieldDataAddressHttpHeaderNamePlaceholder")}
                  valueLabel={translator("assets.new.fieldDataAddressHttpHeaderValue")}
                  valuePlaceholder={"..."}
                  name={TRANSFER_PROCESS_HTTP_HEADERS}
                  id="data-address-http-headers"
                  type="text"
                  required
                  error={errors[TRANSFER_PROCESS_HTTP_HEADERS]}
                  value={formData[TRANSFER_PROCESS_HTTP_HEADERS] as [] || []}
                  onChange={(value) => setFormData({...formData, [TRANSFER_PROCESS_HTTP_HEADERS]: value})}
                />
              </div>
            </>
          }
          {[DATA_ADDRESS_TYPE_HTTP.value, DATA_ADDRESS_TYPE_DATASINK.value].includes(formData[TRANSFER_PROCESS_DATA_ADDRESS_TYPE]) &&
            <>
              {formData[TRANSFER_PROCESS_SHOW_ALL_HTTP_PARAMETERIZATION_FIELDS] ?
                <div className="flex flex-col gap-y-6">
                  <div className="flex gap-x-3">
                    <MuiSelect
                      name={TRANSFER_PROCESS_HTTP_PROXIED_METHOD}
                      id="data-address-method"
                      label={translator("transferProcesses.new.customMethod")}
                      options={[
                        {value: ""},
                        {value: "GET"},
                        {value: "POST"},
                        {value: "PUT"},
                        {value: "PATCH"},
                        {value: "DELETE"},
                      ]}
                      required
                      helperText={<T string="transferProcesses.new.requireProxyBodyTrue"/>}
                      error={errors[TRANSFER_PROCESS_HTTP_PROXIED_METHOD]}
                      value={formData[TRANSFER_PROCESS_HTTP_PROXIED_METHOD]}
                      onChange={(event) => setFormData({
                        ...formData,
                        [TRANSFER_PROCESS_HTTP_PROXIED_METHOD]: event.target.value
                      })}
                    />
                    <Input
                      name={TRANSFER_PROCESS_HTTP_PROXIED_PATH}
                      id="data-address-base-url"
                      data-testid="data-address-base-url"
                      type="url"
                      placeholder={"sub-path/endpoint"}
                      label={translator("transferProcesses.new.customSubpath")}
                      helperText={<T string="transferProcesses.new.requireProxyBodyTrue"/>}
                      error={errors[TRANSFER_PROCESS_HTTP_PROXIED_PATH]}
                      value={formData[TRANSFER_PROCESS_HTTP_PROXIED_PATH]}
                      onChange={(event) => setFormData({
                        ...formData,
                        [TRANSFER_PROCESS_HTTP_PROXIED_PATH]: event.target.value
                      })}
                    />
                  </div>

                  <div className="flex flex-col gap-y-5 items-start">
                    <KeyValuePairInputList
                      name={TRANSFER_PROCESS_HTTP_PROXIED_QUERY_PARAMS}
                      id="data-address-query-params"
                      type="text"
                      label={translator("assets.new.fieldDataAddressQueryParams")}
                      addText={translator("transferProcesses.new.addCustomQueryParam")}
                      keyLabel={translator("assets.new.fieldDataAddressQueryParamsKeyLabel")}
                      keyPlaceholder={translator("assets.new.fieldDataAddressQueryParamsKeyPlaceholder")}
                      valueLabel={translator("assets.new.fieldDataAddressQueryParamsValueLabel")}
                      valuePlaceholder="..."
                      helperText={formData[ASSET_DATA_ADDRESS_ENABLE_QUERY_PARAMETERIZATION] ? translator("assets.new.fieldDataAddressQueryParamsHelper") : ""}
                      error={errors[TRANSFER_PROCESS_HTTP_PROXIED_QUERY_PARAMS]}
                      value={formData[TRANSFER_PROCESS_HTTP_PROXIED_QUERY_PARAMS] as [] || []}
                      onChange={(value) => setFormData({...formData, [TRANSFER_PROCESS_HTTP_PROXIED_QUERY_PARAMS]: value})}
                    />
                  </div>

                  <Input
                    name={TRANSFER_PROCESS_HTTP_PROXIED_BODY_CONTENT_TYPE}
                    id="properties-contenttype"
                    label={<T string="transferProcesses.new.customRequestBodyContentType"/>}
                    placeholder="application/json"
                    helperText={<T string="transferProcesses.new.requireProxyBodyTrue"/>}
                    value={formData[TRANSFER_PROCESS_HTTP_PROXIED_BODY_CONTENT_TYPE]}
                    error={errors[TRANSFER_PROCESS_HTTP_PROXIED_BODY_CONTENT_TYPE]}
                    onChange={(event) => setFormData({
                      ...formData,
                      [TRANSFER_PROCESS_HTTP_PROXIED_BODY_CONTENT_TYPE]: event.target.value
                    })}
                  />

                  <Input
                    name={TRANSFER_PROCESS_HTTP_PROXIED_BODY}
                    id="properties-description"
                    key="properties-description"
                    multiline
                    rows={2}
                    label={<T string="transferProcesses.new.customRequestBodyContentType"/>}
                    placeholder={'{"some": "request-body"}'}
                    required
                    helperText={<T string="transferProcesses.new.requireProxyBodyTrue"/>}
                    classes={{textField: {'& p': {color: theme.palette.error.main}}} as any}
                    error={errors[TRANSFER_PROCESS_HTTP_PROXIED_BODY]}
                    value={formData[TRANSFER_PROCESS_HTTP_PROXIED_BODY]}
                    onChange={(event) => setFormData({
                      ...formData,
                      [TRANSFER_PROCESS_HTTP_PROXIED_BODY]: event.target.value
                    })}
                  />
                </div>
                :
                <div>
                  <Typography variant="h5">
                    <T string="transferProcesses.new.httpParameterizationTitle"/>
                  </Typography>
                  <Typography variant="body2">
                    <T string="transferProcesses.new.httpParameterizationDescription"/>
                  </Typography>
                </div>
              }
              <div>
                <RadioButton
                  id="data-address-enable-body-parameterization"
                  labelTrue={translator("transferProcesses.new.hideHttpParameterization")}
                  labelFalse={translator("transferProcesses.new.showHttpParameterization")}
                  value={formData[TRANSFER_PROCESS_SHOW_ALL_HTTP_PARAMETERIZATION_FIELDS]}
                  onChange={(value) => setFormData({
                    ...formData,
                    [TRANSFER_PROCESS_SHOW_ALL_HTTP_PARAMETERIZATION_FIELDS]: value
                  })}
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
