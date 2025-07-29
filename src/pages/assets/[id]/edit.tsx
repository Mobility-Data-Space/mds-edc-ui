import RadioButtonsGroup from "@/components/atoms/radio-group.tsx";
import { AssetConditionsForUse } from "@/components/molecules/asset-conditions-for-use.tsx";
import { AssetContentType } from "@/components/molecules/asset-content-type.tsx";
import { AssetDataCategoryAndSubcategory } from "@/components/molecules/asset-data-category-and-subcategory.tsx";
import { AssetDataModel } from "@/components/molecules/asset-data-model.tsx";
import { AssetDataSamples } from "@/components/molecules/asset-data-samples.tsx";
import { AssetDataUpdateFrequency } from "@/components/molecules/asset-data-update-frequency.tsx";
import { AssetDescription } from "@/components/molecules/asset-description.tsx";
import { AssetEndpointDocumentation } from "@/components/molecules/asset-endpoint-documentation.tsx";
import { AssetGeoLocations } from "@/components/molecules/asset-geo-locations.tsx";
import { AssetGeoReferenceMethod } from "@/components/molecules/asset-geo-reference-method.tsx";
import { AssetId } from "@/components/molecules/asset-id.tsx";
import { AssetKeywords } from "@/components/molecules/asset-keywords.tsx";
import { AssetLanguage } from "@/components/molecules/asset-language.tsx";
import { AssetNutsLocations } from "@/components/molecules/asset-nuts-locations.tsx";
import { AssetPublisher } from "@/components/molecules/asset-publisher.tsx";
import { AssetReferenceFileUrls } from "@/components/molecules/asset-reference-file-urls.tsx";
import { AssetSovereignLegalName } from "@/components/molecules/asset-sovereign-legal-name.tsx";
import { AssetStandardLicense } from "@/components/molecules/asset-standard-license.tsx";
import { AssetTemporalCoverage } from "@/components/molecules/asset-temporal-coverage.tsx";
import { AssetTitle } from "@/components/molecules/asset-title.tsx";
import { AssetTransportMode } from "@/components/molecules/asset-transport-mode.tsx";
import { AssetVersion } from "@/components/molecules/asset-version.tsx";
import { Snackbar } from "@/components/molecules/snackbar.tsx";
import { FormDataAddressStep } from "@/components/organisms/form-data-address-step.tsx";
import SideDrawer from "@/components/organisms/side-drawer.tsx";
import { DATA_OFFER_TYPE_DATA_SOURCE } from "@/constants/data-address-types.ts";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state.ts";
import { T, useTranslator } from "@/i18n";
import { ASSET_ADVANCED_INFO_DATA_CATEGORY, ASSET_ADVANCED_INFO_MOBILITY_THEME, ASSET_TITLE } from "@/jsonld/asset.ts";
import {AssetProperties, assetToAssetInput, defaultCreateAssetFormData, fromAssetForm, validateDataAddress } from "@/utilities/asset.ts";
import { Button, Checkbox, Divider, FormControlLabel, Typography } from "@mui/material";
import {AssetInput, DataAddress, PolicyDefinitionInput } from "@think-it-labs/edc-connector-client";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client.ts";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { proxyConnectorManagement } from "@/constants/proxy";

const unchangedOfferType = {
  text: "assets.edit.keepDatasourceUnchanged",
  value: "Unchanged",
}

export default function EditAssetPage() {
  const { query: { id } } = useRouter();
  const [offerType, setOfferType] = useState(unchangedOfferType.value);
  const [oldAssetData, setOldAssetData] = useState({} as AssetInput);
  const onChangeOfferType = ((newOfferType: string) => {
    if (newOfferType === unchangedOfferType.value) {
      setFormData({ ...formData, dataAddress: oldAssetData.dataAddress })
    }
    setOfferType(newOfferType);
  });
  const { push, connector } = useParticipantConnectorState();
  const client = useEdcConnectorClient({ management: proxyConnectorManagement });

  useEffect(() => {
    if (! id) {
      return;
    }
    client.management.assets.get(id as string)
    .then(assetToAssetInput)
    .then((assetInput: AssetInput) => {
      setOldAssetData(assetInput);
      setFormData(assetInput);
    })
  }, [client, id]);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const { translator } = useTranslator();

  const [formData, setFormData] = useState<AssetInput>(defaultCreateAssetFormData);

  const [errors, setErrors] = useState({ properties: {}, advancedInfo: {}, dataAddress: {} });

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

  const onChange = (newFormData: AssetInput) => {
    setFormData({ ...newFormData });
  }

  const generalInfoFormOnChange = (generalInfoFormData: AssetProperties) => {
    setErrors((oldErrors) => ({ ...oldErrors, properties: validateGeneralInfo(generalInfoFormData) }));

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
    return newErrors;
  };

  const validateAdvancedInfo = (formDataToValidate: AssetProperties) => {
    const newErrors: { [key: string]: boolean } = {};
    const required_properties = [ASSET_ADVANCED_INFO_DATA_CATEGORY];
    required_properties.forEach((propertyName) => {
      if (!formDataToValidate[ASSET_ADVANCED_INFO_MOBILITY_THEME][propertyName]) {
        newErrors[propertyName] = true;
      }
    });

    return newErrors;
  };
  const onSubmit = () => {
    if (cannotSubmit()) {
      return;
    }
    client.management.assets.update(fromAssetForm(formData, connector.curatorName))
    .then(() => {
      enqueueSnackbar("", {
        content: (key) => <Snackbar
          type="success"
          message={translator('dataOffer.new.assetUpdateSuccess')}
          onClose={() => { closeSnackbar(key) }}
        />
      })
      setTimeout(() => push("/assets"), 2000)
    })
    .catch(() =>
      enqueueSnackbar("", {
        content: (key) => <Snackbar
          type="error"
          message={translator('assets.new.dataOfferCreateError')}
          onClose={() => { closeSnackbar(key) }}
        />
      })
    );
  };

  if (!connector) {
    return "No connector";
  }

  return (
    <SideDrawer title={<T string="assets.edit.title" />}>
      <form>
        <div className="flex flex-col gap-y-12">

          <div className="flex flex-col gap-y-5 ">
            <div className="grid sm:grid-cols-3 gap-2 sm:gap-6">
              <div className="sm:col-span-1">
                <label className="inline-block text-sm text-black mt-2.5" >
                  <Typography variant="h6">
                    <T string="dataOffer.new.dataOfferTypeTitle" />
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <T string="dataOffer.new.dataOfferTypeDescription" />
                  </Typography>
                </label>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-6">
                <RadioButtonsGroup
                  name="data-offer-type"
                  id="data-offer-type"
                  label={<T string="dataOffer.new.type"/>}
                  value={offerType}
                  defaultValue={offerType}
                  options={[
                    {
                      ...unchangedOfferType,
                      text: translator(unchangedOfferType.text)
                    },
                    DATA_OFFER_TYPE_DATA_SOURCE,
                  ]}
                  onChange={onChangeOfferType}
                />
                {offerType === "Unchanged" ? "" :
                  <FormDataAddressStep
                    translator={translator}
                    formData={formData.dataAddress}
                    onChange={dataAddressFormOnChange}
                    errors={errors.dataAddress}
                    methodAlwaysShowing
                    customDataAddressConfigRows={6}
                  />
                }
              </div>
            </div>

            <Divider />

            <div className="grid sm:grid-cols-3 gap-2 sm:gap-6">
              <div className="sm:col-span-1">
                <label className="inline-block text-sm text-black mt-2.5">
                  <Typography variant="h6">
                    <T string="dataOffer.new.dataOfferGeneralInfoTitle" />
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <T string="dataOffer.new.dataOfferGeneralInfoDescription" />
                  </Typography>
                </label>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-6">
                <div>
                  <label
                    htmlFor="properties-title"
                    className="inline-block text-sm text-black font-medium mb-2"
                  >
                    <T string="assets.new.fieldTitle" /> *
                  </label>
                  <AssetTitle
                    hideLabel
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
                    <T string="assets.new.fieldId" /> *
                  </label>
                  <AssetId
                    hideLabel
                    disabled
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
                    <T string="assets.new.fieldDescription" />
                  </label>
                  <AssetDescription
                    formData={formData.properties}
                    errors={errors.properties}
                    onChange={generalInfoFormOnChange}
                    translator={translator}
                    data-testid="asset-description"
                  />
                </div>

                <div>
                  <label
                    htmlFor="properties-keywords"
                    className="inline-block text-sm text-black font-medium mb-2"
                  >
                    <T string="assets.new.fieldKeywords" />
                  </label>
                  <AssetKeywords
                    formData={formData.properties}
                    errors={errors.properties}
                    onChange={generalInfoFormOnChange}
                    translator={translator}
                  />
                </div>

                <FormControlLabel
                  label={<T string="dataOffer.new.showAdvancedFields" />}
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
                      <T string="assets.new.fieldVersion" />
                    </label>
                    <AssetVersion
                      hideLabel
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
                      <T string="assets.new.fieldLanguage" />
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

            <Divider />

            <div className="grid sm:grid-cols-3 gap-2 sm:gap-6">
              <div className="sm:col-span-1">
                <label
                  htmlFor="id"
                  className="inline-block text-sm text-black mt-2.5"
                >
                  <Typography variant="h6">
                    <T string="dataOffer.new.dataOfferMobilityInfoTitle" />
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <T string="dataOffer.new.dataOfferMobilityInfoDescription" />
                  </Typography>
                </label>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-6">
                <AssetDataCategoryAndSubcategory
                  translator={translator}
                  formData={formData.properties}
                  onChange={advancedInfoFormOnChange}
                  errors={errors.advancedInfo}
                />

                {!showAdvancedFields ? "" : <>
                  <div>
                    <label
                      htmlFor="advanced-info-geo-reference-method"
                      className="inline-block text-sm text-black font-medium mb-2"
                    >
                      <T string="assets.new.fieldAdvancedInfoTransportMode" />
                    </label>
                    <AssetTransportMode
                      translator={translator}
                      formData={formData.properties}
                      onChange={advancedInfoFormOnChange}
                      errors={errors.advancedInfo}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="advanced-data-model"
                      className="inline-block text-sm text-black font-medium mb-2"
                    >
                      <T string="assets.new.fieldAdvancedInfoDataModel" />
                    </label>
                    <AssetDataModel
                      translator={translator}
                      formData={formData.properties}
                      onChange={advancedInfoFormOnChange}
                      errors={errors.advancedInfo}
                    />
                  </div>
                </>}
              </div>
            </div>

            {!showAdvancedFields ? "" : <>
              <Divider />

              <div className="grid sm:grid-cols-3 gap-2 sm:gap-6">
                <div className="sm:col-span-1">
                  <label
                    htmlFor="id"
                    className="inline-block text-sm text-black mt-2.5"
                  >
                    <Typography variant="h6">
                      <T string="dataOffer.new.dataOfferDocumentationTitle" />
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <T string="dataOffer.new.dataOfferDocumentationDescription" />
                    </Typography>
                  </label>
                </div>
                <div className="sm:col-span-2 flex flex-col gap-6">
                  <div>
                    <label
                      htmlFor="advanced-data-model"
                      className="inline-block text-sm text-black font-medium mb-2"
                    >
                      <T string="assets.new.fieldAdvancedInfoDataModel" />
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
                      formData={formData.properties}
                      onChange={advancedInfoFormOnChange}
                      errors={errors.advancedInfo}
                    />
                  </div>

                  <div>
                    <AssetReferenceFileUrls
                      translator={translator}
                      formData={formData.properties}
                      onChange={advancedInfoFormOnChange}
                      errors={errors.advancedInfo}
                    />
                  </div>
                </div>
              </div>

              <Divider />

              <div className="grid sm:grid-cols-3 gap-2 sm:gap-6">
                <div className="sm:col-span-1">
                  <label
                    htmlFor="id"
                    className="inline-block text-sm text-black mt-2.5"
                  >
                    <Typography variant="h6">
                      <T string="dataOffer.new.dataOfferLocationTimeTitle" />
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <T string="dataOffer.new.dataOfferLocationTimeDescription" />
                    </Typography>
                  </label>
                </div>
                <div className="sm:col-span-2 flex flex-col gap-6">
                  <AssetTemporalCoverage
                    translator={translator}
                    formData={formData.properties}
                    onChange={advancedInfoFormOnChange}
                    errors={errors.advancedInfo}
                  />

                  <div>
                    <label
                      htmlFor="advanced-data-update-frequency"
                      className="inline-block text-sm text-black font-medium mb-2"
                    >
                      <T string="assets.new.fieldAdvancedDataUpdateFrequency" />
                    </label>
                    <AssetDataUpdateFrequency
                      translator={translator}
                      formData={formData.properties}
                      onChange={advancedInfoFormOnChange}
                      errors={errors.advancedInfo}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="advanced-data-update-frequency"
                      className="inline-block text-sm text-black font-medium mb-2"
                    >
                      <T string="assets.new.fieldAdvancedInfoGeoReferenceMethod" />
                    </label>
                    <AssetGeoReferenceMethod
                      translator={translator}
                      formData={formData.properties}
                      onChange={advancedInfoFormOnChange}
                      errors={errors.advancedInfo}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="advanced-geo-location"
                      className="inline-block text-sm text-black font-medium mb-2"
                    >
                      <T string="assets.new.fieldAdvancedGeoLocation" />
                    </label>
                    <AssetGeoLocations
                      translator={translator}
                      formData={formData.properties}
                      onChange={advancedInfoFormOnChange}
                      errors={errors.advancedInfo}
                    />
                  </div>

                  <div>
                    <AssetNutsLocations
                      translator={translator}
                      formData={formData.properties}
                      onChange={advancedInfoFormOnChange}
                      errors={errors.advancedInfo}
                    />
                  </div>
                </div>
              </div>

              <Divider />

              <div className="grid sm:grid-cols-3 gap-2 sm:gap-6">
                <div className="sm:col-span-1">
                  <label
                    htmlFor="id"
                    className="inline-block text-sm text-black mt-2.5"
                  >
                    <Typography variant="h6">
                      <T string="dataOffer.new.dataOfferLegalInfoTitle" />
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      <T string="dataOffer.new.dataOfferLegalInfoDescription" />
                    </Typography>
                  </label>
                </div>
                <div className="sm:col-span-2 flex flex-col gap-6">
                  <div>
                    <label
                      htmlFor="advanced-geo-location"
                      className="inline-block text-sm text-black font-medium mb-2"
                    >
                      <T string="assets.new.fieldAdvancedInfoSovereignLegalName" />
                    </label>
                    <AssetSovereignLegalName
                      translator={translator}
                      formData={formData.properties}
                      onChange={advancedInfoFormOnChange}
                      errors={errors.advancedInfo}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="advanced-geo-location"
                      className="inline-block text-sm text-black font-medium mb-2"
                    >
                      <T string="assets.new.fieldPublisher" />
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
                      <T string="assets.new.fieldStandardLicense" />
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
                      <T string="assets.new.fieldAdvancedInfoConditionsForUse" />
                    </label>
                    <AssetConditionsForUse
                      translator={translator}
                      formData={formData.properties}
                      onChange={advancedInfoFormOnChange}
                      errors={errors.properties}
                    />
                  </div>
                </div>
              </div>
            </>}
          </div>

          <Divider />

          <div className="flex justify-end px-6 py-4">
            <Button
              data-testid="data-offer-create-submit"
              variant="contained"
              ref={submitButtonRef}
              onClick={onSubmit}
              disabled={cannotSubmit()}
            >
              <T string="common.update" />
            </Button>
          </div>
        </div>

      </form>
    </SideDrawer>
  );
}
