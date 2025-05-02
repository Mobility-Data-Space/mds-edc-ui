import React, {useRef, useState} from "react";
import { ConnectorDashboard } from "@/components/templates/connector-dashboard";
import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { T, useTranslator } from "@/i18n";
import { AssetForm } from "@think-it-labs/edc-connector-ui/asset-html-form.tsx";
import {Button, Step, StepContent, StepLabel, Stepper} from "@mui/material";
import { AssetCreateFormGeneralInfoStepContent } from "@/components/organisms/asset-create-form-general-info-step-content.tsx";
import { AssetCreateFormDataAddressStep } from "@/components/organisms/asset-create-form-data-address-step.tsx";
import {ASSET_ID, assetFormDataToSubmitData, computeRequiredDataAddressProperties, CreateAssetAdvancedInfoFormData, CreateAssetDataAddressFormData, CreateAssetFormData, CreateAssetPropertiesFormData, defaultCreateAssetFormData, REQUIRED_ADVANCED_INFO, REQUIRED_PROPERTIES} from "@/schema/asset.ts";
import {AssetCreateFormAdvancedInfoStepContent} from "@/components/organisms/asset-create-form-advanced-step-content.tsx";

export default function CreateAssetForm() {
  const { push, connector } = useConnectorDashboardState();
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const { translator } = useTranslator();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<CreateAssetFormData>(defaultCreateAssetFormData);
  const [errors, setErrors] = useState({ properties: {}, advancedInfo: {}, dataAddress: {} });

  const generalInfoIsNotValid = () => {
    return 0 < Object.entries(validateGeneralInfo(formData.properties)).length
  }

  const advancedInfoIsNotValid = () => {
    return 0 < Object.entries(validateAdvancedInfo(formData.advancedInfo)).length
  }

  const dataAddressIsNotValid = () => {
    return 0 < Object.entries(validateDataAddress(formData.dataAddress)).length
  }

  const cannotSubmit = () => {
    return generalInfoIsNotValid() || advancedInfoIsNotValid() || dataAddressIsNotValid();
  }

  const tryGoToAdvancedStep = () => {
    const validationErrors = validateGeneralInfo(formData.properties);
    setErrors((oldErrors) => ({ ...oldErrors, properties: validationErrors }));
    if (0 === Object.entries(validationErrors).length) {
      setActiveStep(1);
      return true;
    }

    return false;
  }

  const tryGoingToDataSourceStep = () => {
    const validationErrors = validateAdvancedInfo(formData.advancedInfo);
    setErrors((oldErrors) => ({ ...oldErrors, advancedInfo: validationErrors }));
    if (0 === Object.entries(validationErrors).length) {
      setActiveStep(2);
      return true;
    }

    return false;
  }

  const onChange = (newFormData: CreateAssetFormData) => {
    setFormData({ ...newFormData });
  }

  const generalInfoFormOnChange = (generalInfoFormData: CreateAssetPropertiesFormData) => {
    setErrors((oldErrors) => ({ ...oldErrors, properties: validateGeneralInfo(generalInfoFormData) }));

    return onChange({ ...formData, properties: generalInfoFormData, [ASSET_ID]: generalInfoFormData[ASSET_ID] });
  };

  const dataAddressFormOnChange = (dataAddressFormData: CreateAssetDataAddressFormData) => {
    setErrors((oldErrors) => ({ ...oldErrors, dataAddress: validateDataAddress(dataAddressFormData) }));

    return onChange({ ...formData, dataAddress: dataAddressFormData });
  };

  const advancedInfoFormOnChange = (advancedInfoFormData: CreateAssetAdvancedInfoFormData) => {
    setErrors((oldErrors) => ({ ...oldErrors, advancedInfo: validateAdvancedInfo(advancedInfoFormData) }));

    return onChange({ ...formData, advancedInfo: advancedInfoFormData });
  };

  const validateGeneralInfo = (formDataToValidate: CreateAssetPropertiesFormData) => {
    const newErrors: { [key: string]: boolean } = {};
    REQUIRED_PROPERTIES.forEach((propertyName) => {
      if (! formDataToValidate[propertyName]) {
        newErrors[propertyName] = true;
      }
    });

    return newErrors;
  };

  const validateAdvancedInfo = (formDataToValidate: CreateAssetAdvancedInfoFormData) => {
    const newErrors: { [key: string]: boolean } = {};
    REQUIRED_ADVANCED_INFO.forEach((propertyName) => {
      if (! formDataToValidate[propertyName]) {
        newErrors[propertyName] = true;
      }
    });

    return newErrors;
  };

  const validateDataAddress = (formDataToValidate: CreateAssetDataAddressFormData) => {
    const newErrors: { [key: string]: boolean } = {};
    const required = computeRequiredDataAddressProperties(formDataToValidate);
    required.forEach((propertyName) => {
      if (! formDataToValidate[propertyName]) {
        newErrors[propertyName] = true;
      }
    });

    return newErrors;
  }

  const setFormErrors = () => {
    return {
      properties: validateGeneralInfo(formData.properties),
      advancedInfo: validateAdvancedInfo(formData.advancedInfo),
      dataAddress: validateDataAddress(formData.dataAddress),
    }
  };

  const onSubmit = () => {
    if (cannotSubmit()) {
      setFormErrors();
      return;
    }

    // TODO: asset id already exist

    if (submitButtonRef.current && submitButtonRef.current.form) {
      submitButtonRef.current.form.requestSubmit();
    }
  };

  const onFormSubmitFail = (error: Error) => {
    console.log('onFormSubmitFail : ', error);
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

      <AssetForm
        managementUrl={connector.managementUrl}
        onSuccess={() => push("/my-assets")}
        getFormDataToSubmit={() => assetFormDataToSubmitData(formData)}
        onFailure={onFormSubmitFail}
      >
        <Stepper activeStep={activeStep} orientation="vertical" className="p-5">
          <Step>
            <div className="my-2" data-testid="asset-create-general-info-step-title">
              <Button fullWidth color="secondary">
                <StepLabel onClick={() => setActiveStep(0)} className={"w-full justify-start p-4"} >
                  <T string="assets.new.generalInformation"/>
                </StepLabel>
              </Button>
            </div>
            <StepContent>
              <div data-testid="asset-create-general-info-step-content">
                <AssetCreateFormGeneralInfoStepContent
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
                <StepLabel onClick={tryGoToAdvancedStep} className={"w-full justify-start p-4"}>
                  <T string="assets.new.advancedInformation"/>
                </StepLabel>
              </Button>
            </div>
            <StepContent>
              <div data-testid="asset-create-advanced-info-step-content">
                <AssetCreateFormAdvancedInfoStepContent
                  translator={translator}
                  formData={formData.advancedInfo}
                  onChange={advancedInfoFormOnChange}
                  errors={errors.advancedInfo}
                />
              </div>
            </StepContent>
          </Step>

          <Step>
            <div className="my-2" data-testid="asset-create-data-address-step-title">
              <Button fullWidth color="secondary">
                <StepLabel onClick={tryGoingToDataSourceStep} className={"w-full justify-start p-4"}>
                  <T string="assets.new.datasourceInformation"/>
                </StepLabel>
              </Button>
            </div>
            <StepContent>
              <div data-testid="asset-create-data-address-step-content">
                <AssetCreateFormDataAddressStep
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
            onClick={() => push("/my-assets")}
          >
            <T string="common.cancel"/>
          </Button>
          <Button
            data-testid="asset-create-submit"
            variant="contained"
            ref={submitButtonRef}
            onClick={onSubmit}
            disabled={cannotSubmit()}
          >
            <T string="common.create"/>
          </Button>
        </div>
      </AssetForm>

    </div>
  );
}
