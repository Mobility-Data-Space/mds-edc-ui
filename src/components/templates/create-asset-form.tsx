import React, {useEffect, useRef, useState} from "react";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import {Button, Step, StepContent, StepIconProps, StepLabel, Stepper} from "@mui/material";
import { AssetCreateFormGeneralInfoStepContent } from "@/components/organisms/asset-create-form-general-info-step-content.tsx";
import { AssetCreateFormDataAddressStep } from "@/components/organisms/asset-create-form-data-address-step.tsx";
import {ASSET_ADVANCED_INFO_DATA_CATEGORY, ASSET_DATA_ADDRESS_DESCRIPTION, ASSET_DATA_ADDRESS_TYPE, ASSET_TITLE, ASSET_VERSION} from "@/schema/asset.ts";
import {AssetCreateFormAdvancedInfoStepContent} from "@/components/organisms/asset-create-form-advanced-step-content.tsx";
import {fromAssetForm, computeRequiredDataAddressProperties, generateId, defaultCreateAssetFormData, AssetProperties} from "@/utilities/asset.ts";
import {useEdcConnectorClient} from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client.ts";
import { enqueueSnackbar } from 'notistack';
import {DATA_ADDRESS_TYPE_CUSTOM} from "@/constants/data-address-types.ts";
import {StepIcon} from "@/components/atoms/step-icon.tsx";
import { AssetFormWrapper } from "@think-it-labs/edc-connector-ui/asset-form-wrapper";
import { AssetInput, DataAddress } from "@think-it-labs/edc-connector-client";

const stepLabelSharedProps = {
  className: "w-full justify-start p-4",
  slots: { stepIcon: (props: StepIconProps) => <StepIcon {...props} /> },
}

export default function CreateAssetForm() {
  const { push, connector } = useParticipantConnectorState();
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const { translator } = useTranslator();

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<AssetInput>(defaultCreateAssetFormData);
  const [errors, setErrors] = useState({ properties: {}, dataAddress: {} });
  const [existingIds, setExistingIds] = useState<string[]>([]);

  const client = useEdcConnectorClient({ management: connector.managementUrl });
  useEffect(() => {
    client.management.assets.queryAll({ offset: 0 })
    .then(assets => setExistingIds(assets.map(asset => asset["@id"])));
  }, []);

  const generalInfoIsNotValid = () => {
    return 0 < Object.entries(validateGeneralInfo(formData.properties)).length
  }

  const advancedInfoIsNotValid = () => {
    return 0 < Object.entries(validateAdvancedInfo(formData.properties)).length
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
    const validationErrors = validateAdvancedInfo(formData.properties);
    setErrors((oldErrors) => ({ ...oldErrors, advancedInfo: validationErrors }));
    if (0 === Object.entries(validationErrors).length) {
      setActiveStep(2);
      return true;
    }

    return false;
  }

  const onChange = (newFormData: AssetInput) => {
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
    setErrors((oldErrors) => ({ ...oldErrors, dataAddress: validateDataAddress(dataAddressFormData) }));

    return onChange({ ...formData, dataAddress: dataAddressFormData });
  };

  const advancedInfoFormOnChange = (advancedInfoFormData: AssetProperties) => {
    setErrors((oldErrors) => ({ ...oldErrors, advancedInfo: validateAdvancedInfo(advancedInfoFormData) }));

    return onChange({ ...formData, properties: advancedInfoFormData });
  };

  const validateGeneralInfo = (formDataToValidate: AssetProperties) => {
    const newErrors: { [key: string]: boolean | string } = {};
    const required_properties = [ASSET_TITLE, "@id"] ;
    required_properties.forEach((propertyName) => {
      if (! formDataToValidate[propertyName]) {
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
    const required_properties = [ASSET_ADVANCED_INFO_DATA_CATEGORY] ;
    required_properties.forEach((propertyName) => {
      if (! formDataToValidate[propertyName]) {
        newErrors[propertyName] = true;
      }
    });

    return newErrors;
  };

  const validateDataAddress = (formDataToValidate: DataAddress) => {
    const newErrors: { [key: string]: boolean | string } = {};
    const required = computeRequiredDataAddressProperties(formDataToValidate);
    required.forEach((propertyName) => {
      if (! formDataToValidate[propertyName]) {
        newErrors[propertyName] = true;
      }
    });

    if (formDataToValidate[ASSET_DATA_ADDRESS_TYPE] === DATA_ADDRESS_TYPE_CUSTOM.value && formDataToValidate[ASSET_DATA_ADDRESS_DESCRIPTION] !== "") {
      try {
        JSON.parse(formDataToValidate[ASSET_DATA_ADDRESS_DESCRIPTION] as string);
      } catch (e) {
        newErrors[ASSET_DATA_ADDRESS_DESCRIPTION] = translator("assets.new.mustBeValidJson");
      }
    }

    return newErrors;
  }

  const setFormErrors = () => {
    return {
      properties: validateAdvancedInfo(validateGeneralInfo(formData.properties)),
      dataAddress: validateDataAddress(formData.dataAddress),
    }
  };

  const onSubmit = () => {
    if (cannotSubmit()) {
      setFormErrors();
      return;
    }

    if (submitButtonRef.current && submitButtonRef.current.form) {
      submitButtonRef.current.form.requestSubmit();
    }
  };

  const onFormSubmitFail = (error: Error) => {
    enqueueSnackbar(translator("assets.new.saveFail"));
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
        managementUrl={connector.managementUrl}
        onSuccess={() => push("/assets")}
        formData={() => fromAssetForm(formData)}
        onFailure={onFormSubmitFail}
      >
        <Stepper activeStep={activeStep} orientation="vertical" className="p-5">
          <Step>
            <div className="my-2" data-testid="asset-create-general-info-step-title">
              <Button fullWidth color="secondary">
                <StepLabel onClick={() => setActiveStep(0)} {...stepLabelSharedProps} >
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
                <StepLabel onClick={tryGoToAdvancedStep} {...stepLabelSharedProps}>
                  <T string="assets.new.advancedInformation"/>
                </StepLabel>
              </Button>
            </div>
            <StepContent>
              <div data-testid="asset-create-advanced-info-step-content">
                <AssetCreateFormAdvancedInfoStepContent
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
            onClick={() => push("/assets")}
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
      </AssetFormWrapper>

    </div>
  );
}
