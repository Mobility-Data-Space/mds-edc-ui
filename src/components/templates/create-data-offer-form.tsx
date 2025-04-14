import React, {useRef, useState} from "react";
import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { T, useTranslator } from "@/i18n";
import { AssetForm } from "@think-it-labs/edc-connector-ui/asset-html-form.tsx";
import { AssetCreateFormDataAddressStep } from "@/components/organisms/asset-create-form-data-address-step.tsx";
import {
  ASSET_ID, assetFormDataToSubmitData,
  computeRequiredDataOfferAddressProperties, CreateAssetAdvancedInfoFormData,
  CreateAssetDataAddressFormData,
  CreateAssetFormData,
  CreateAssetPropertiesFormData, DATA_OFFER_CONSTRAINTS, DATA_OFFER_PUBLISH_MODE, DATA_OFFER_TYPE,
  defaultCreateAssetFormData, REQUIRED_ADVANCED_INFO,
  REQUIRED_PROPERTIES
} from "@/schema/asset.ts";
import Typography from "@mui/material/Typography";
import RadioButtonsGroup from "@/components/atoms/radio-group.tsx";
import {AssetContactEmailAndSubject} from "@/components/molecules/asset-contact-email-and-subject.tsx";
import {
  DATA_OFFER_TYPE_DATA_SOURCE, DATA_OFFER_TYPE_ON_REQUEST,
  DATA_OFFER_TYPES,
  PUBLISH_MODE_PUBLISH_RESTRICTED, PUBLISH_MODE_PUBLISH_UNRESTRICTED,
  PUBLISH_MODES
} from "@/constants/data-address-types.ts";
import {AssetDataCategoryAndSubcategory} from "@/components/molecules/asset-data-category-and-subcategory.tsx";
import Divider from "@mui/material/Divider";
import {AssetTitle} from "@/components/molecules/asset-title.tsx";
import {AssetId} from "@/components/molecules/asset-id.tsx";
import {AssetDescription} from "@/components/molecules/asset-description.tsx";
import {AssetKeywords} from "@/components/molecules/asset-keywords.tsx";
import FormControlLabel from "@mui/material/FormControlLabel";
import {Button, Checkbox} from "@mui/material";
import {AssetLanguage} from "@/components/molecules/asset-language.tsx";
import {AssetVersion} from "@/components/molecules/asset-version.tsx";
import {AssetTransportMode} from "@/components/molecules/asset-transport-mode.tsx";
import {AssetDataModel} from "@/components/molecules/asset-data-model.tsx";
import {AssetContentType} from "@/components/molecules/asset-content-type.tsx";
import {AssetEndpointDocumentation} from "@/components/molecules/asset-endpoint-documentation.tsx";
import {AssetDataSamples} from "@/components/molecules/asset-data-samples.tsx";
import {AssetReferenceFileUrls} from "@/components/molecules/asset-reference-file-urls.tsx";
import {AssetDataUpdateFrequency} from "@/components/molecules/asset-data-update-frequency.tsx";
import {AssetGeoReferenceMethod} from "@/components/molecules/asset-geo-reference-method.tsx";
import {AssetGeoLocations} from "@/components/molecules/asset-geo-locations.tsx";
import {AssetNutsLocations} from "@/components/molecules/asset-nuts-locations.tsx";
import {AssetSovereignLegalName} from "@/components/molecules/asset-sovereign-legal-name.tsx";
import {AssetPublisher} from "@/components/molecules/asset-publisher.tsx";
import {AssetStandardLicense} from "@/components/molecules/asset-standard-license.tsx";
import {AssetConditionsForUse} from "@/components/molecules/asset-conditions-for-use.tsx";
import {AssetTemporalCoverage} from "@/components/molecules/asset-temporal-coverage.tsx";
import PolicyExpression from "@/components/organisms/policy-expression.tsx";

export default function CreateDataOfferForm() {
  const { push, connector } = useConnectorDashboardState();
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const { translator } = useTranslator();
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
    const required = computeRequiredDataOfferAddressProperties(formDataToValidate);
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

  const dataOfferTypeIsDataSource = formData.dataAddress[DATA_OFFER_TYPE] === DATA_OFFER_TYPE_DATA_SOURCE.value;

  if (!connector) {
    return "No connector";
  }

  return (
    <AssetForm
      managementUrl={connector.managementUrl}
      onSuccess={() => push("/assets")}
      getFormDataToSubmit={() => assetFormDataToSubmitData(formData)}
      onFailure={onFormSubmitFail}
    >
      <div className="flex flex-col gap-y-12">

        <div className="flex flex-col gap-y-5 ">
          <div className="grid sm:grid-cols-3 gap-2 sm:gap-6">
            <div className="sm:col-span-1">
              <label
                htmlFor="id"
                className="inline-block text-sm text-black mt-2.5"
              >
                <Typography variant="h6">
                  <T string="dataOffer.new.dataOfferTypeTitle"/>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <T string="dataOffer.new.dataOfferTypeDescription"/>
                </Typography>
              </label>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-6">
              <RadioButtonsGroup
                name={DATA_OFFER_TYPE}
                id="data-offer-type"
                label={<T string="dataOffer.new.type"/>}
                defaultValue={DATA_OFFER_TYPE_ON_REQUEST.value}
                options={DATA_OFFER_TYPES}
                onChange={(value) => dataAddressFormOnChange({...formData.dataAddress, [DATA_OFFER_TYPE]: value})}
              />
              {dataOfferTypeIsDataSource ?
                <AssetCreateFormDataAddressStep
                  translator={translator}
                  formData={formData.dataAddress}
                  onChange={dataAddressFormOnChange}
                  errors={errors.dataAddress}
                  methodAlwaysShowing
                /> :
                <AssetContactEmailAndSubject
                  translator={translator}
                  formData={formData.dataAddress}
                  onChange={dataAddressFormOnChange}
                  errors={errors.dataAddress}
                />}
            </div>
          </div>

          <Divider/>

          <div className="grid sm:grid-cols-3 gap-2 sm:gap-6">
            <div className="sm:col-span-1">
              <label
                className="inline-block text-sm text-black mt-2.5"
              >
                <Typography variant="h6">
                  <T string="dataOffer.new.dataOfferGeneralInfoTitle"/>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <T string="dataOffer.new.dataOfferGeneralInfoDescription"/>
                </Typography>
              </label>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-6">
              <div>
                <label
                  htmlFor="properties-title"
                  className="inline-block text-sm text-black font-medium mb-2"
                >
                  <T string="assets.new.fieldTitle"/>
                </label>
                <AssetTitle
                  formData={formData.properties}
                  errors={errors.properties}
                  onChange={generalInfoFormOnChange}
                  translator={translator}
                />
              </div>

              <div>
                <label
                  htmlFor="properties-id"
                  className="inline-block text-sm text-black font-medium mb-2"
                >
                  <T string="assets.new.fieldId"/>
                </label>
                <AssetId
                  formData={formData.properties}
                  errors={errors.properties}
                  onChange={generalInfoFormOnChange}
                  translator={translator}
                />
              </div>

              <div>
                <label
                  htmlFor="properties-description"
                  className="inline-block text-sm text-black font-medium mb-2"
                >
                  <T string="assets.new.fieldDescription"/>
                </label>
                <AssetDescription
                  formData={formData.properties}
                  errors={errors.properties}
                  onChange={generalInfoFormOnChange}
                  translator={translator}
                />
              </div>

              <div>
                <label
                  htmlFor="properties-keywords"
                  className="inline-block text-sm text-black font-medium mb-2"
                >
                  <T string="assets.new.fieldKeywords"/>
                </label>
                <AssetKeywords
                  formData={formData.properties}
                  errors={errors.properties}
                  onChange={generalInfoFormOnChange}
                  translator={translator}
                />
              </div>

              <FormControlLabel
                label={<T string="dataOffer.new.showAdvancedFields"/>}
                control={
                  <Checkbox
                    color="secondary"
                    checked={showAdvancedFields}
                    onChange={() => setShowAdvancedFields((value) => !value)}
                  />
                }
              />

              {!showAdvancedFields ? "" : <>
                <div>
                  <label
                    htmlFor="properties-version"
                    className="inline-block text-sm text-black font-medium mb-2"
                  >
                    <T string="assets.new.fieldVersion"/>
                  </label>
                  <AssetVersion
                    formData={formData.properties}
                    errors={errors.properties}
                    onChange={generalInfoFormOnChange}
                    translator={translator}
                  />
                </div>
                <div>
                  <label
                    htmlFor="properties-language"
                    className="inline-block text-sm text-black font-medium mb-2"
                  >
                    <T string="assets.new.fieldLanguage"/>
                  </label>
                  <AssetLanguage
                    formData={formData.properties}
                    errors={errors.properties}
                    onChange={generalInfoFormOnChange}
                  />
                </div>
              </>}
            </div>
          </div>

          <Divider/>

          <div className="grid sm:grid-cols-3 gap-2 sm:gap-6">
            <div className="sm:col-span-1">
              <label
                htmlFor="id"
                className="inline-block text-sm text-black mt-2.5"
              >
                <Typography variant="h6">
                  <T string="dataOffer.new.dataOfferMobilityInfoTitle"/>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <T string="dataOffer.new.dataOfferMobilityInfoDescription"/>
                </Typography>
              </label>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-6">
              <AssetDataCategoryAndSubcategory
                translator={translator}
                formData={formData.advancedInfo}
                onChange={advancedInfoFormOnChange}
                errors={errors.advancedInfo}
              />

              {! showAdvancedFields ? "" : <>
                <div>
                  <label
                    htmlFor="advanced-info-geo-reference-method"
                    className="inline-block text-sm text-black font-medium mb-2"
                  >
                    <T string="assets.new.fieldAdvancedInfoTransportMode"/>
                  </label>
                  <AssetTransportMode
                    translator={translator}
                    formData={formData.advancedInfo}
                    onChange={advancedInfoFormOnChange}
                    errors={errors.advancedInfo}
                  />
                </div>
                <div>
                  <label
                    htmlFor="advanced-data-model"
                    className="inline-block text-sm text-black font-medium mb-2"
                  >
                    <T string="assets.new.fieldAdvancedInfoDataModel"/>
                  </label>
                  <AssetDataModel
                    translator={translator}
                    formData={formData.advancedInfo}
                    onChange={advancedInfoFormOnChange}
                    errors={errors.advancedInfo}
                  />
                </div>
              </>}
            </div>
          </div>

          {!showAdvancedFields ? "" : <>

            <Divider/>

            <div className="grid sm:grid-cols-3 gap-2 sm:gap-6">
              <div className="sm:col-span-1">
                <label
                  htmlFor="id"
                  className="inline-block text-sm text-black mt-2.5"
                >
                  <Typography variant="h6">
                    <T string="dataOffer.new.dataOfferDocumentationTitle"/>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <T string="dataOffer.new.dataOfferDocumentationDescription"/>
                  </Typography>
                </label>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-6">
                <div>
                  <label
                    htmlFor="advanced-data-model"
                    className="inline-block text-sm text-black font-medium mb-2"
                  >
                    <T string="assets.new.fieldAdvancedInfoDataModel"/>
                  </label>
                  <AssetEndpointDocumentation
                    formData={formData.properties}
                    errors={errors.properties}
                    onChange={generalInfoFormOnChange}
                    translator={translator}
                  />
                </div>

                <div>
                  <AssetContentType
                    formData={formData.properties}
                    errors={errors.properties}
                    onChange={generalInfoFormOnChange}
                  />
                </div>

                <div>
                  <AssetDataSamples
                    translator={translator}
                    formData={formData.advancedInfo}
                    onChange={advancedInfoFormOnChange}
                    errors={errors.advancedInfo}
                  />
                </div>

                <div>
                  <AssetReferenceFileUrls
                    translator={translator}
                    formData={formData.advancedInfo}
                    onChange={advancedInfoFormOnChange}
                    errors={errors.advancedInfo}
                  />
                </div>
              </div>
            </div>

            <Divider/>

            <div className="grid sm:grid-cols-3 gap-2 sm:gap-6">
              <div className="sm:col-span-1">
                <label
                  htmlFor="id"
                  className="inline-block text-sm text-black mt-2.5"
                >
                  <Typography variant="h6">
                  <T string="dataOffer.new.dataOfferLocationTimeTitle"/>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <T string="dataOffer.new.dataOfferLocationTimeDescription"/>
                  </Typography>
                </label>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-6">
                <AssetTemporalCoverage
                  translator={translator}
                  formData={formData.advancedInfo}
                  onChange={advancedInfoFormOnChange}
                  errors={errors.advancedInfo}
                />

                <div>
                  <label
                    htmlFor="advanced-data-update-frequency"
                    className="inline-block text-sm text-black font-medium mb-2"
                  >
                    <T string="assets.new.fieldAdvancedDataUpdateFrequency"/>
                  </label>
                  <AssetDataUpdateFrequency
                    translator={translator}
                    formData={formData.advancedInfo}
                    onChange={advancedInfoFormOnChange}
                    errors={errors.advancedInfo}
                  />
                </div>

                <div>
                  <label
                    htmlFor="advanced-data-update-frequency"
                    className="inline-block text-sm text-black font-medium mb-2"
                  >
                    <T string="assets.new.fieldAdvancedInfoGeoReferenceMethod"/>
                  </label>
                  <AssetGeoReferenceMethod
                    translator={translator}
                    formData={formData.advancedInfo}
                    onChange={advancedInfoFormOnChange}
                    errors={errors.advancedInfo}
                  />
                </div>

                <div>
                  <label
                    htmlFor="advanced-geo-location"
                    className="inline-block text-sm text-black font-medium mb-2"
                  >
                    <T string="assets.new.fieldAdvancedGeoLocation"/>
                  </label>
                  <AssetGeoLocations
                    translator={translator}
                    formData={formData.advancedInfo}
                    onChange={advancedInfoFormOnChange}
                    errors={errors.advancedInfo}
                  />
                </div>

                <div>
                  <AssetNutsLocations
                    translator={translator}
                    formData={formData.advancedInfo}
                    onChange={advancedInfoFormOnChange}
                    errors={errors.advancedInfo}
                  />
                </div>
              </div>
            </div>

            <Divider/>

            <div className="grid sm:grid-cols-3 gap-2 sm:gap-6">
              <div className="sm:col-span-1">
                <label
                  htmlFor="id"
                  className="inline-block text-sm text-black mt-2.5"
                >
                  <Typography variant="h6">
                    <T string="dataOffer.new.dataOfferLegalInfoTitle"/>
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <T string="dataOffer.new.dataOfferLegalInfoDescription"/>
                  </Typography>
                </label>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-6">
                <div>
                  <label
                    htmlFor="advanced-geo-location"
                    className="inline-block text-sm text-black font-medium mb-2"
                  >
                    <T string="assets.new.fieldAdvancedInfoSovereignLegalName"/>
                  </label>
                  <AssetSovereignLegalName
                    translator={translator}
                    formData={formData.advancedInfo}
                    onChange={advancedInfoFormOnChange}
                    errors={errors.advancedInfo}
                  />
                </div>

                <div>
                  <label
                    htmlFor="advanced-geo-location"
                    className="inline-block text-sm text-black font-medium mb-2"
                  >
                    <T string="assets.new.fieldPublisher"/>
                  </label>
                  <AssetPublisher
                    translator={translator}
                    formData={formData.properties}
                    onChange={generalInfoFormOnChange}
                    errors={errors.properties}
                  />
                </div>

                <div>
                  <label
                    htmlFor="advanced-geo-location"
                    className="inline-block text-sm text-black font-medium mb-2"
                  >
                    <T string="assets.new.fieldStandardLicense"/>
                  </label>
                  <AssetStandardLicense
                    translator={translator}
                    formData={formData.properties}
                    onChange={generalInfoFormOnChange}
                    errors={errors.properties}
                  />
                </div>

                <div>
                  <label
                    htmlFor="advanced-geo-location"
                    className="inline-block text-sm text-black font-medium mb-2"
                  >
                    <T string="assets.new.fieldAdvancedInfoConditionsForUse"/>
                  </label>
                  <AssetConditionsForUse
                    translator={translator}
                    formData={formData.advancedInfo}
                    onChange={advancedInfoFormOnChange}
                    errors={errors.properties}
                  />
                </div>
              </div>
            </div>
          </>}

          <Divider/>

          <div className="grid sm:grid-cols-3 gap-2 sm:gap-6">
            <div className="sm:col-span-1">
              <label
                htmlFor="id"
                className="inline-block text-sm text-black mt-2.5"
              >
                <Typography variant="h6">
                  <T string="dataOffer.new.dataOfferPublishingTitle"/>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <T string="dataOffer.new.dataOfferPublishingDescription"/>
                </Typography>
              </label>
            </div>
            <div className="sm:col-span-2 flex flex-col gap-6">
              <RadioButtonsGroup
                name={DATA_OFFER_PUBLISH_MODE}
                id="data-offer-type"
                label={<T string="dataOffer.new.type"/>}
                defaultValue={PUBLISH_MODE_PUBLISH_UNRESTRICTED.value}
                options={PUBLISH_MODES}
                onChange={(value) => generalInfoFormOnChange({
                  ...formData.properties,
                  [DATA_OFFER_PUBLISH_MODE]: value
                })}
              />
              {formData.properties[DATA_OFFER_PUBLISH_MODE] !== PUBLISH_MODE_PUBLISH_RESTRICTED.value ? "" : <div>
                <label
                  className="inline-block text-sm text-black font-medium mb-2"
                >
                  <T string="dataOffer.new.policyExpression"/>
                </label>
                <PolicyExpression
                  value={formData.properties[DATA_OFFER_CONSTRAINTS]}
                  onChange={(value) => generalInfoFormOnChange({
                    ...formData.properties,
                    [DATA_OFFER_CONSTRAINTS]: value
                  })}
                />
              </div>
              }
            </div>
          </div>
        </div>

        <Divider />

        <div className="flex justify-end px-6 py-4">
          <Button
            variant="contained"
            ref={submitButtonRef}
            onClick={onSubmit}
            disabled={cannotSubmit()}
          >
          <T string="dataOffer.new.publish"/>
          </Button>
        </div>
      </div>

    </AssetForm>
  );
}

