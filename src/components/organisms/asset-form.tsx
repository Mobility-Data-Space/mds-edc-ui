import { useAppSnackbar } from "@/hooks/use-app-snackbar";
import { extractEdcErrorMessage } from "@/utilities/edc-error";
import {
  Button,
  Step,
  StepContent,
  StepIconProps,
  StepLabel,
  Stepper,
} from "@mui/material";
import { AssetFormWrapper } from "@think-it-labs/edc-connector-ui/asset-form-wrapper";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/use-edc-connector";
import { useEffect, useRef, useState } from "react";

import { StepIcon } from "@/components/atoms/step-icon";
import { AssetFormAdvancedInfoStepContent } from "@/components/organisms/asset-form-advanced-step-content";
import { FormDataAddressStep } from "@/components/organisms/form-data-address-step";
import { AssetFormGeneralInfoStepContent } from "@/components/organisms/asset-form-general-info-step-content";

import { Snackbar } from "@/components/molecules/snackbar";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { fromAssetForm } from "@/domain/asset/mapper";
import { validateAdvancedInfo } from "@/domain/asset/validation";
import { useAssetForm } from "@/hooks/use-asset-form";
import { proxyConnectorManagement } from "@/constants/proxy";

const stepLabelSharedProps = {
  className: "w-full justify-start p-4",
  slots: { stepIcon: (props: StepIconProps) => <StepIcon {...props} /> },
};

interface AssetFormProps {
  onClose: () => void;
}

export default function AssetForm({ onClose }: AssetFormProps) {
  const { connector } = useParticipantConnectorState();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { showSnackbar } = useAppSnackbar();

  const { translator } = useTranslator();

  const [activeStep, setActiveStep] = useState(0);
  const [existingIds, setExistingIds] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [formErrorDetails, setFormErrorDetails] = useState<string | null>(null);

  const clearFormError = () => {
    setFormError(null);
    setFormErrorDetails(null);
  };

  const form = useAssetForm({ generateIdFromTitle: true, existingIds, onEdit: clearFormError });
  const { asset, errors, setErrors, validateGeneralInfo } = form;

  const client = useEdcConnectorClient({
    management: proxyConnectorManagement,
  });

  useEffect(() => {
    client.management.assets
      .queryAll({ offset: 0 })
      .then((assets) => setExistingIds(assets.map((asset) => asset["@id"])));
  }, [client]);

  const tryGoToAdvancedStep = () => {
    clearFormError();
    const validationErrors = validateGeneralInfo(asset.properties);
    setErrors((oldErrors) => ({ ...oldErrors, properties: validationErrors }));
    if (0 === Object.entries(validationErrors).length) {
      setActiveStep(1);
      return true;
    }

    return false;
  };

  const tryGoingToDataSourceStep = () => {
    clearFormError();
    const validationErrors = validateAdvancedInfo(asset.properties);
    setErrors((oldErrors) => ({
      ...oldErrors,
      advancedInfo: validationErrors,
    }));
    if (0 === Object.entries(validationErrors).length) {
      setActiveStep(2);
      return true;
    }

    return false;
  };

  const onSubmit = () => {
    if (form.isInvalid()) {
      setFormError(translator("assets.new.formHasErrors"));
      setFormErrorDetails(null);
      form.validateAll();
      return;
    }
    clearFormError();
    if (submitButtonRef.current && submitButtonRef.current.form) {
      submitButtonRef.current.form.requestSubmit();
    }
  };

  const onFormSubmitFail = (error: Error) => {
    let handled = false;
    const message = extractEdcErrorMessage(error) || error.message;
    if (/already exists|duplicate/i.test(message)) {
      setErrors((oldErrors) => ({
        ...oldErrors,
        properties: {
          ...oldErrors.properties,
          ["@id"]: translator("assets.new.fieldIdAlreadyExists") || message,
        },
      }));
      setFormError(translator("assets.new.duplicateId") || message);
      setFormErrorDetails(message);
      handled = true;
    }
    if (!handled) {
      setFormError(translator("assets.new.saveFail"));
      setFormErrorDetails(message);
    }
  };

  if (!connector) {
    return <T string="common.noConnector" />;
  }

  return (
    <div>
      <div className="text-3xl">
        <span data-testid="asset-create-modal-title">
          <T string="assets.new.title" />
        </span>
      </div>

      <AssetFormWrapper
        managementUrl={proxyConnectorManagement}
        onSuccess={() => {
          showSnackbar({
            type: "success",
            message: translator("assets.createSuccess"),
            persist: false,
          });
          window.dispatchEvent(new Event("assets-list-refetch"));
          onClose();
        }}
        formData={() => fromAssetForm(asset, connector?.curatorName)}
        onFailure={onFormSubmitFail}
      >
        <Stepper activeStep={activeStep} orientation="vertical" className="p-5">
          <Step>
            <div
              className="my-2"
              data-testid="asset-create-general-info-step-title"
            >
              <Button fullWidth color="secondary">
                <StepLabel
                  onClick={() => setActiveStep(0)}
                  {...stepLabelSharedProps}
                >
                  <T string="assets.new.generalInformation" />
                </StepLabel>
              </Button>
            </div>
            <StepContent>
              <div data-testid="asset-create-general-info-step-content">
                <AssetFormGeneralInfoStepContent
                  formData={asset.properties}
                  onChange={form.onGeneralInfoChange}
                  errors={errors.properties}
                  translator={translator}
                />
              </div>
            </StepContent>
          </Step>

          <Step>
            <div
              className="my-2"
              data-testid="asset-create-advanced-info-step-title"
            >
              <Button fullWidth color="secondary">
                <StepLabel
                  onClick={tryGoToAdvancedStep}
                  {...stepLabelSharedProps}
                >
                  <T string="assets.new.advancedInformation" />
                </StepLabel>
              </Button>
            </div>
            <StepContent>
              <div data-testid="asset-create-advanced-info-step-content">
                <AssetFormAdvancedInfoStepContent
                  translator={translator}
                  formData={asset.properties}
                  onChange={form.onAdvancedInfoChange}
                  errors={errors.advancedInfo}
                />
              </div>
            </StepContent>
          </Step>

          <Step>
            <div
              className="my-2"
              data-testid="asset-create-data-address-step-title"
            >
              <Button fullWidth color="secondary">
                <StepLabel
                  onClick={tryGoingToDataSourceStep}
                  {...stepLabelSharedProps}
                >
                  <T string="assets.new.datasourceInformation" />
                </StepLabel>
              </Button>
            </div>
            <StepContent>
              <div data-testid="asset-create-data-address-step-content">
                <FormDataAddressStep
                  translator={translator}
                  formData={asset.dataAddress}
                  onChange={form.onDataAddressChange}
                  errors={errors.dataAddress}
                />
              </div>
            </StepContent>
          </Step>
        </Stepper>

        <div className="flex justify-end gap-x-2 px-6 py-4">
          <Button color="secondary" onClick={onClose}>
            <T string="common.cancel" />
          </Button>
          <Button
            data-testid="asset-create-submit"
            variant="contained"
            ref={submitButtonRef}
            onClick={onSubmit}
            disabled={form.isInvalid()}
          >
            <T string="common.create" />
          </Button>
        </div>
      </AssetFormWrapper>

      {formError && (
        <div style={{ position: "fixed", bottom: 16, right: 16, zIndex: 9999 }}>
          <Snackbar
            type="error"
            message={formError}
            details={formErrorDetails || undefined}
            onClose={() => clearFormError()}
          />
        </div>
      )}
    </div>
  );
}
