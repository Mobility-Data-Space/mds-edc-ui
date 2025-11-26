import { useEffect, useRef, useState } from "react";
import { enqueueSnackbar } from "notistack";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/use-edc-connector";
import { ContractDefinitionFormWrapper } from "@think-it-labs/edc-connector-ui/contract-definition-form-wrapper";
import { T } from "@/i18n";
import {
  fromContractDefinitionForm,
  MdsContractDefinitionInput,
} from "@/utilities/contract-definition";
import { defaultCreateContractDefinitionFormData } from "@/utilities/contract-definition";
import { MuiSelect } from "@/components/atoms/mui-select";
import { Input } from "@/components/atoms/input";
import { Checkbox } from "@/components/atoms/checkbox";
import { idMultipleReader, idMultipleSelector } from "@/utilities/data-offer";
import { Asset } from "@think-it-labs/edc-connector-client";
import AssetDialog from "@/components/organisms/asset-dialog.tsx";
import { removeJsonLdSchemaFromProperties } from "@/utilities/catalog";
import { readValue } from "@think-it-labs/edc-connector-ui/json-ld";
import { assetToAssetInput, fromAssetForm } from "@/utilities/asset";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";

interface DataOfferCreateDialogProps {
  open: boolean;
  onClose: () => void;
  managementUrl: string;
  connectorEndpoint: string;
  participantId: string;
  translator: (key: string) => string;
  onSuccess?: () => void;
}

const optionsGenerator = (data: { "@id": string }[]) => {
  return data.map((entry) => ({
    value: entry["@id"],
  }));
};

const validateId = (
  id: string | undefined,
  translator: (str: string) => string
) => {
  if (!id) {
    return true;
  }

  if (!/^[^\s:]*$/.test(id)) {
    return translator("assets.new.invalidWhitespacesOrColons");
  }

  return false;
};

export default function DataOfferCreateDialog({
  open,
  onClose,
  managementUrl,
  connectorEndpoint,
  participantId,
  translator,
  onSuccess = () => {},
}: DataOfferCreateDialogProps) {
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const [assetDialogIsOpen, setAssetDialogIsOpen] = useState(false);
  const [clickedAsset, setClickedAsset] = useState({} as Asset);
  const [assetsById, setAssetsById] = useState<{ [key: string]: Asset }>({});
  const [assetIds, setAssetIds] = useState<{ value: string }[]>([]);
  const [policyIds, setPolicyIds] = useState<{ value: string }[]>([]);

  const [idError, setIdError] = useState<string | boolean>(false);

  const edcClient = useEdcConnectorClient({ management: managementUrl });
  const { connector } = useParticipantConnectorState();

  useEffect(() => {
    edcClient.management.assets
      .queryAll({ offset: 0 })
      .then((result) => {
        setAssetIds(optionsGenerator(result));
        const assets: { [key: string]: Asset } = {};
        result.forEach((asset) => {
          assets[asset.id] = asset;
        });
        setAssetsById(assets);
      })
      .catch((error) => {
        setAssetIds([]);
        setAssetsById({});
      });

    edcClient.management.policyDefinitions
      .queryAll({ offset: 0 })
      .then((result) => setPolicyIds(optionsGenerator(result)))
      .catch((error) => setPolicyIds([]));
  }, [edcClient]);

  const [formData, setFormData] = useState<MdsContractDefinitionInput>(
    defaultCreateContractDefinitionFormData
  );
  const validateForm = () => true;

  const onChange = (newFormData: MdsContractDefinitionInput) => {
    setFormData({ ...newFormData });
  };
  const onSubmit = () => {
    if (!validateForm()) {
      return;
    }

    if (submitButtonRef.current && submitButtonRef.current.form) {
      submitButtonRef.current.form.requestSubmit();
    }
  };

  const handleContractDefinitionSuccess = async () => {
    const selectedAssetIds: string[] =
      formData.assetsSelector[0].operandRight.split(",");
    const selectedAssets = selectedAssetIds
      .map((assetId) => assetsById[assetId])
      .filter((asset) => !!asset);

    await Promise.all(
      selectedAssets.map(async (asset) => {
        try {
          const assetInput = await assetToAssetInput(asset);

          const updatedAssetInput = {
            ...assetInput,
            properties: {
              ...assetInput.properties,
              additionalProperties: {
                ...assetInput.properties.additionalProperties,
                manual_approval: String(
                  formData.privateProperties.manualApproval
                ),
              },
            },
          };
          await edcClient.management.assets.update(
            fromAssetForm(updatedAssetInput, connector.curatorName)
          );
        } catch (e) {
          console.log("Error updating asset", e);
        }
      })
    );

    onSuccess();
    onClose();
  };

  const onFormSubmitFail = (error: Error) => {
    const match = /"message":"(.*?)"/.exec(error.message);
    enqueueSnackbar(
      (match && match[1]) || translator("policyDefinition.new.saveFail")
    );
  };

  return (
    <>
      <AssetDialog
        asset={clickedAsset}
        participantId={participantId}
        connectorEndpoint={connectorEndpoint}
        open={assetDialogIsOpen}
        onClose={() => setAssetDialogIsOpen(false)}
      />
      <Dialog
        open={open}
        maxWidth="lg"
        className="my-7"
        onClose={onClose}
        data-testid="create-data-offer-dialog"
      >
        <ContractDefinitionFormWrapper
          managementUrl={managementUrl}
          formData={() => fromContractDefinitionForm(formData)}
          onSuccess={handleContractDefinitionSuccess}
          onFailure={onFormSubmitFail}
        >
          <DialogTitle>
            <Typography variant="h5">
              <T string="contractDefinitions.new.publishNewDataOffer" />
            </Typography>
          </DialogTitle>
          <DialogContent style={{ maxWidth: "80vw", width: "800px" }}>
            <div className="flex flex-col pt-5 gap-y-5">
              <div>
                <Input
                  required
                  name="contract-definition-id"
                  id="contract-definition-id"
                  data-testid="contract-definition-id-input"
                  label={translator("contractDefinitions.new.id")}
                  value={formData["@id"]}
                  error={idError}
                  onChange={(event) => {
                    setIdError(validateId(event.target.value, translator));
                    onChange({ ...formData, ["@id"]: event.target.value });
                  }}
                />
              </div>

              <MuiSelect
                required
                name="contract-policy-id"
                id="contract-policy-id"
                data-testid="contract-policy-id"
                label={translator("contractDefinitions.new.contractPolicy")}
                options={policyIds}
                value={formData.contractPolicyId}
                onChange={(event) =>
                  onChange({
                    ...formData,
                    contractPolicyId: event.target.value,
                  })
                }
              />

              <MuiSelect
                required
                name="access-policy-id"
                id="access-policy-id"
                data-testid="access-policy-id"
                label={translator("contractDefinitions.new.accessPolicy")}
                options={policyIds}
                value={formData.accessPolicyId}
                onChange={(event) =>
                  onChange({ ...formData, accessPolicyId: event.target.value })
                }
              />

              <MuiSelect
                multiple
                required
                name="assets-selector"
                id="asset-id"
                data-testid="asset-id"
                label={translator("contractDefinitions.new.assets")}
                options={assetIds}
                value={idMultipleReader(formData.assetsSelector)}
                onChange={(event) =>
                  onChange({
                    ...formData,
                    assetsSelector: idMultipleSelector(event.target.value),
                  })
                }
              />

              <Checkbox
                label={translator("contractDefinitions.new.manualApproval")}
                value={formData.privateProperties.manualApproval}
                onChange={(event) => {
                  onChange({
                    ...formData,
                    privateProperties: { manualApproval: event.target.checked },
                  });
                }}
              />

              <div className="flex gap-4">
                {idMultipleReader(formData.assetsSelector).map((assetId) => (
                  <div
                    key={assetId}
                    className="p-4 rounded shadow-sm"
                    onClick={() => {
                      setClickedAsset(assetsById[assetId]);
                      setAssetDialogIsOpen(true);
                    }}
                  >
                    <Typography
                      component="a"
                      className="hover:underline cursor-pointer"
                    >
                      {assetId}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <div className="flex flex-row self-end gap-x-5 pr-3 pb-3">
              <Button color="secondary" onClick={onClose}>
                <T string="common.cancel" />
              </Button>
              <Button
                ref={submitButtonRef}
                variant="contained"
                color="primary"
                onClick={onSubmit}
                data-testid="create-button"
              >
                <T string="common.create" />
              </Button>
            </div>
          </DialogActions>
        </ContractDefinitionFormWrapper>
      </Dialog>
    </>
  );
}
