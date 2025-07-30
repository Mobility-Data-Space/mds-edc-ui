import { Button, Step, StepContent, StepIconProps, StepLabel, Stepper } from "@mui/material";
import { AssetInput, DataAddress } from "@think-it-labs/edc-connector-client";
import { AssetFormWrapper } from "@think-it-labs/edc-connector-ui/asset-form-wrapper";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";
import { useSnackbar } from 'notistack';
import { useEffect, useRef, useState } from "react";

import { StepIcon } from "@/components/atoms/step-icon";
import { AssetFormAdvancedInfoStepContent } from "@/components/organisms/asset-form-advanced-step-content";
import { FormDataAddressStep } from "@/components/organisms/form-data-address-step";
import { AssetFormGeneralInfoStepContent } from "@/components/organisms/asset-form-general-info-step-content";

import { Snackbar } from "@/components/molecules/snackbar";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { ASSET_ADVANCED_INFO_DATA_CATEGORY, ASSET_ADVANCED_INFO_MOBILITY_THEME, ASSET_TITLE, ASSET_VERSION } from "@/jsonld/asset";
import { AssetProperties, defaultCreateAssetFormData, fromAssetForm, generateId, validateDataAddress } from "@/utilities/asset";
import { proxyConnectorManagement } from "@/constants/proxy";

const stepLabelSharedProps = {
  className: "w-full justify-start p-4",
  slots: { stepIcon: (props: StepIconProps) => <StepIcon {...props} /> },
}

interface AssetFormProps {
  onClose: () => void;
}

export default function AssetForm({ onClose }: AssetFormProps) {
  const { push, connector } = useParticipantConnectorState();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const { translator } = useTranslator();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<AssetInput>(defaultCreateAssetFormData);

  const [existingIds, setExistingIds] = useState<string[]>([]);
  const [errors, setErrors] = useState({ properties: {}, dataAddress: {} });

  const client = useEdcConnectorClient({ management: proxyConnectorManagement });

  const [formError, setFormError] = useState<string | null>(null);
  const [formErrorDetails, setFormErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    client.management.assets.queryAll({ offset: 0 })
      .then(assets => setExistingIds(assets.map(asset => asset["@id"])));
  }, [client]);

  const generalInfoIsNotValid = () => {
    return 0 < Object.entries(validateGeneralInfo(formData.properties)).length
  }

  const advancedInfoIsNotValid = () => {
    return 0 < Object.entries(validateAdvancedInfo(formData.properties)).length
  }

  const dataAddressIsNotValid = () => {
    return 0 < Object.entries(validateDataAddress(formData.dataAddress, translator)).length
  }

  const cannotSubmit = () => {
    return generalInfoIsNotValid() || advancedInfoIsNotValid() || dataAddressIsNotValid();
  }

  const clearFormError = () => {
    setFormError(null);
    setFormErrorDetails(null);
  };

  const tryGoToAdvancedStep = () => {
    clearFormError();
    const validationErrors = validateGeneralInfo(formData.properties);
    setErrors((oldErrors) => ({ ...oldErrors, properties: validationErrors }));
    if (0 === Object.entries(validationErrors).length) {
      setActiveStep(1);
      return true;
    }

    return false;
  }

  const tryGoingToDataSourceStep = () => {
    clearFormError();
    const validationErrors = validateAdvancedInfo(formData.properties);
    setErrors((oldErrors) => ({ ...oldErrors, advancedInfo: validationErrors }));
    if (0 === Object.entries(validationErrors).length) {
      setActiveStep(2);
      return true;
    }

    return false;
  }

  const onChange = (newFormData: AssetInput) => {
    clearFormError();
    setFormData({ ...newFormData });
  }

  const generalInfoFormOnChange = (generalInfoFormData: AssetProperties) => {
    setErrors((oldErrors) => ({ ...oldErrors, properties: validateGeneralInfo(generalInfoFormData) }));

    const generatedOldId = generateId(formData.properties[ASSET_TITLE] as string, formData.properties[ASSET_VERSION] as string);
    if (generatedOldId === generalInfoFormData["@id"]) {
      generalInfoFormData["@id"] = generateId(generalInfoFormData[ASSET_TITLE] as string, generalInfoFormData[ASSET_VERSION] as string);
    }

    return onChange({ ...formData, properties: generalInfoFormData, ["@id"]: generalInfoFormData["@id"] });
  };

  const dataAddressFormOnChange = (dataAddressFormData: DataAddress) => {
    setErrors((oldErrors) => ({ ...oldErrors, dataAddress: validateDataAddress(dataAddressFormData, translator) }));
    return onChange({ ...formData, dataAddress: dataAddressFormData });
  };

  const advancedInfoFormOnChange = (advancedInfoFormData: AssetProperties) => {
    setErrors((oldErrors) => ({ ...oldErrors, advancedInfo: validateAdvancedInfo(advancedInfoFormData) }));

    return onChange({ ...formData, properties: advancedInfoFormData });
  };

  const validateGeneralInfo = (formDataToValidate: AssetProperties) => {
    const newErrors: { [key: string]: boolean | string } = {};
    const required_properties = [ASSET_TITLE, "@id"];
    required_properties.forEach((propertyName) => {
      if (!formDataToValidate[propertyName]) {
        newErrors[propertyName] = true;
      }
    });

    const idAlreadyExist = existingIds.includes(formDataToValidate["@id"]);
    if (! /^[^\s:]*$/.test(formDataToValidate["@id"])) {
      newErrors["@id"] = translator('assets.new.invalidWhitespacesOrColons');
    } else if (idAlreadyExist) {
      newErrors["@id"] = translator('assets.new.fieldIdAlreadyExists');
    }

    return newErrors;
  };

  const validateAdvancedInfo = (formDataToValidate: AssetProperties) => {
    const newErrors: { [key: string]: boolean } = {};
    const requiredProperties = [ASSET_ADVANCED_INFO_DATA_CATEGORY];
    requiredProperties.forEach((propertyName) => {
      if (!formDataToValidate[ASSET_ADVANCED_INFO_MOBILITY_THEME][propertyName]) {
        newErrors[propertyName] = true;
      }
    });

    return newErrors;
  };

  const setFormErrors = () => {
    return {
      properties: validateAdvancedInfo(validateGeneralInfo(formData.properties)),
      dataAddress: validateDataAddress(formData.dataAddress, translator),
    }
  };

  const onSubmit = () => {
    if (cannotSubmit()) {
      setFormError(translator("assets.new.formHasErrors"));
      setFormErrorDetails(null);
      setFormErrors();
      return;
    }
    clearFormError();
    if (submitButtonRef.current && submitButtonRef.current.form) {
      submitButtonRef.current.form.requestSubmit();
    }
  };

  const onFormSubmitFail = (error: Error) => {
    let handled = false;
    const match = /"message":"(.*?)"/.exec(error.message);
    const message = (match && match[1]) || error.message;
    if (/already exists|duplicate/i.test(message)) {
      setErrors((oldErrors) => ({
        ...oldErrors,
        properties: { ...oldErrors.properties, ["@id"]: translator("assets.new.fieldIdAlreadyExists") || message },
      }));
      setFormError(translator("assets.new.duplicateId") || message);
      setFormErrorDetails(message);
      handled = true;
    }
    if (!handled) {
      setFormError(translator("assets.new.saveFail"));
      setFormErrorDetails(message);
    }
  }

  if (!connector) {
    return "No connector";
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
          enqueueSnackbar("", {
            content: (key) => (
              <Snackbar
                type="success"
                message={translator('assets.createSuccess')}
                onClose={() => { closeSnackbar(key); }}
              />
            )
          });
          window.dispatchEvent(new Event("list-refetch"));
          onClose()
        }}
        formData={() => fromAssetForm(formData, connector.curatorName)}
        onFailure={onFormSubmitFail}
      >
        <Stepper activeStep={activeStep} orientation="vertical" className="p-5">
          <Step>
            <div className="my-2" data-testid="asset-create-general-info-step-title">
              <Button fullWidth color="secondary">
                <StepLabel onClick={() => setActiveStep(0)} {...stepLabelSharedProps} >
                  <T string="assets.new.generalInformation" />
                </StepLabel>
              </Button>
            </div>
            <StepContent>
              <div data-testid="asset-create-general-info-step-content">
                <AssetFormGeneralInfoStepContent
                  formData={formData.properties}
                  onChange={generalInfoFormOnChange}
                  errors={errors.properties}
                  translator={translator}
                />
              </div>
            </StepContent>
          </Step>

          <Step>
            <div className="my-2" data-testid="asset-create-advanced-info-step-title">
              <Button fullWidth color="secondary">
                <StepLabel onClick={tryGoToAdvancedStep} {...stepLabelSharedProps}>
                  <T string="assets.new.advancedInformation" />
                </StepLabel>
              </Button>
            </div>
            <StepContent>
              <div data-testid="asset-create-advanced-info-step-content">
                <AssetFormAdvancedInfoStepContent
                  translator={translator}
                  formData={formData.properties}
                  onChange={advancedInfoFormOnChange}
                  errors={errors.properties}
                />
              </div>
            </StepContent>
          </Step>

          <Step>
            <div className="my-2" data-testid="asset-create-data-address-step-title">
              <Button fullWidth color="secondary">
                <StepLabel onClick={tryGoingToDataSourceStep} {...stepLabelSharedProps}>
                  <T string="assets.new.datasourceInformation" />
                </StepLabel>
              </Button>
            </div>
            <StepContent>
              <div data-testid="asset-create-data-address-step-content">
                <FormDataAddressStep
                  translator={translator}
                  formData={formData.dataAddress}
                  onChange={dataAddressFormOnChange}
                  errors={errors.dataAddress}
                />
              </div>
            </StepContent>
          </Step>
        </Stepper>

        <div className="flex justify-end gap-x-2 px-6 py-4">
          <Button
            color="secondary"
            onClick={() => push("/assets")}
          >
            <T string="common.cancel" />
          </Button>
          <Button
            data-testid="asset-create-submit"
            variant="contained"
            ref={submitButtonRef}
            onClick={onSubmit}
            disabled={cannotSubmit()}
          >
            <T string="common.create" />
          </Button>
        </div>
      </AssetFormWrapper>

      {formError && (
        <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
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
