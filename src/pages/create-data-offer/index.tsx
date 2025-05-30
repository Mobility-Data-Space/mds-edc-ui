import React, {useEffect, useRef, useState} from "react";
import {Button, Checkbox, FormControlLabel, Divider, Typography} from "@mui/material";
import {enqueueSnackbar} from "notistack";
import { AssetInput, AtomicConstraint, CriterionInput, DataAddress, PolicyDefinitionInput } from "@think-it-labs/edc-connector-client";
import {useEdcConnectorClient} from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";
import {useParticipantConnectorState} from "@/hooks/use-participant-connector-state";
import {T, useTranslator} from "@/i18n";
import RadioButtonsGroup from "@/components/atoms/radio-group";
import {AssetDataCategoryAndSubcategory} from "@/components/molecules/asset-data-category-and-subcategory";
import {AssetTitle} from "@/components/molecules/asset-title";
import {AssetId} from "@/components/molecules/asset-id";
import {AssetDescription} from "@/components/molecules/asset-description";
import {AssetKeywords} from "@/components/molecules/asset-keywords";
import {AssetLanguage} from "@/components/molecules/asset-language";
import {AssetVersion} from "@/components/molecules/asset-version";
import {AssetTransportMode} from "@/components/molecules/asset-transport-mode";
import {AssetDataModel} from "@/components/molecules/asset-data-model";
import {AssetContentType} from "@/components/molecules/asset-content-type";
import {AssetEndpointDocumentation} from "@/components/molecules/asset-endpoint-documentation";
import {AssetDataSamples} from "@/components/molecules/asset-data-samples";
import {AssetReferenceFileUrls} from "@/components/molecules/asset-reference-file-urls";
import {AssetDataUpdateFrequency} from "@/components/molecules/asset-data-update-frequency";
import {AssetGeoReferenceMethod} from "@/components/molecules/asset-geo-reference-method";
import {AssetGeoLocations} from "@/components/molecules/asset-geo-locations";
import {AssetNutsLocations} from "@/components/molecules/asset-nuts-locations";
import {AssetSovereignLegalName} from "@/components/molecules/asset-sovereign-legal-name";
import {AssetPublisher} from "@/components/molecules/asset-publisher";
import {AssetStandardLicense} from "@/components/molecules/asset-standard-license";
import {AssetConditionsForUse} from "@/components/molecules/asset-conditions-for-use";
import {AssetTemporalCoverage} from "@/components/molecules/asset-temporal-coverage";
import PolicyExpression from "@/components/organisms/policy-expression";
import SideDrawer from "@/components/organisms/side-drawer";
import { AssetFormDataAddressStep } from "@/components/organisms/asset-form-data-address-step";
import { defaultCreatePolicyFormData, fromPolicyDefinitionForm } from "@/utilities/policy";
import { defaultCreateContractDefinitionFormData, fromContractDefinitionForm, MdsContractDefinitionInput } from "@/utilities/contract-definition";
import { defaultCreateAssetFormData, AssetProperties, generateId, fromAssetForm } from "@/utilities/asset"
import {ASSET_ADVANCED_INFO_DATA_CATEGORY, ASSET_ADVANCED_INFO_MOBILITY_THEME, ASSET_TITLE } from "@/schema/asset";
import {PUBLISH_MODE_DO_NOT_PUBLISH, PUBLISH_MODE_PUBLISH_RESTRICTED, PUBLISH_MODE_PUBLISH_UNRESTRICTED, PUBLISH_MODES} from "@/constants/data-address-types";
import { DataAddressTypes } from "@/utilities/data-address";
import { MultiplicityConstraint, operatorIn } from "@/utilities/policy-constraints";

interface DataOffer {
  asset: AssetInput,
  policy: PolicyDefinitionInput,
  contract: MdsContractDefinitionInput
}

export default function CreateDataOfferPage() {
  const { push, connector } = useParticipantConnectorState();

  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const { translator } = useTranslator();

  const [formData, setFormData] = useState<DataOffer>({
    asset: defaultCreateAssetFormData,
    policy: defaultCreatePolicyFormData,
    contract: defaultCreateContractDefinitionFormData
  });
  const [policyExpression, setPolicyExpression] = useState<(AtomicConstraint|MultiplicityConstraint)[]>([]);
  const [publishMode, setPublishMode] = useState("")

  const [errors, setErrors] = useState({ properties: {}, advancedInfo: {}, dataAddress: {} });

  const [existingIds, setExistingIds] = useState<string[]>([]);
  const client = useEdcConnectorClient({ management: connector.managementUrl });
  useEffect(() => {
    client.management.assets.queryAll({ offset: 0 })
    .then(assets => setExistingIds(assets.map(asset => asset["@id"])));
  }, []);

  const generalInfoIsNotValid = () => {
    return 0 < Object.entries(validateGeneralInfo(formData.asset.properties)).length
  }

  const advancedInfoIsNotValid = () => {
    return 0 < Object.entries(validateAdvancedInfo(formData.asset.properties)).length
  }

  const dataAddressIsNotValid = () => {
    return 0 < Object.entries(validateDataAddress(formData.asset.dataAddress)).length
  }

  const cannotSubmit = () => {
    return generalInfoIsNotValid() || advancedInfoIsNotValid() || dataAddressIsNotValid();
  }

  const onChange = (newFormData: DataOffer) => {
    setFormData({ ...newFormData });
  }

  const generalInfoFormOnChange = (generalInfoFormData: AssetProperties) => {
    setErrors((oldErrors) => ({ ...oldErrors, properties: validateGeneralInfo(generalInfoFormData) }));

    const generatedOldId = generateId(formData.asset.properties[ASSET_TITLE] as string);
    if (generatedOldId === generalInfoFormData["@id"]) {
      generalInfoFormData["@id"] = generateId(generalInfoFormData[ASSET_TITLE] as string);
    }

    return onChange({ ...formData, asset: { ...formData.asset, properties: generalInfoFormData, ["@id"]: generalInfoFormData["@id"] }});
  };

  const dataAddressFormOnChange = (dataAddressFormData: DataAddress) => {
    setErrors((oldErrors) => ({ ...oldErrors, dataAddress: validateDataAddress(dataAddressFormData) }));

    return onChange({ ...formData, asset: {...formData.asset, dataAddress: dataAddressFormData }});
  };

  const advancedInfoFormOnChange = (advancedInfoFormData: AssetProperties) => {
    setErrors((oldErrors) => ({ ...oldErrors, advancedInfo: validateAdvancedInfo(advancedInfoFormData) }));

    return onChange({ ...formData, asset: { ...formData.asset, properties: advancedInfoFormData }});
  };

  const policyExpressionFormOnChange = (policy: (AtomicConstraint | MultiplicityConstraint)[]) => {
    return setPolicyExpression(policy)
  }

  const validateGeneralInfo = (formDataToValidate: AssetProperties) => {
    console.log(formDataToValidate)
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
    console.log(newErrors)
    return newErrors;
  };

  const validateAdvancedInfo = (formDataToValidate: AssetProperties) => {
    const newErrors: { [key: string]: boolean } = {};
    const required_properties = [ASSET_ADVANCED_INFO_DATA_CATEGORY] ;
    required_properties.forEach((propertyName) => {
      if (! formDataToValidate[ASSET_ADVANCED_INFO_MOBILITY_THEME][propertyName]) {
        newErrors[propertyName] = true;
      }
    });

    return newErrors;
  };

  const validateDataAddress = (formDataToValidate: DataAddress) => {
    const newErrors: { [key: string]: boolean | string } = {};

    if (formDataToValidate.type === DataAddressTypes.CustomJson && formDataToValidate.description !== "") {
      try {
        JSON.parse(formDataToValidate.description as string);
      } catch (e) {
        newErrors["ASSET_DATA_ADDRESS_DESCRIPTION"] = translator("assets.new.mustBeValidJson");
      }
    }

    return newErrors;
  }

  const setFormErrors = () => {
    return {
      properties: validateGeneralInfo(formData.asset.properties),
      advancedInfo: validateAdvancedInfo(formData.asset.properties),
      dataAddress: validateDataAddress(formData.asset.dataAddress),
    };
  };

  const idSelector = (id: string): CriterionInput[] => {
    return [
      {
        operandLeft: "@id",
        operator: operatorIn.value,
        operandRight: id
      }
    ]
  };
  
  const onSubmit = () => {
    if (cannotSubmit()) {
      setFormErrors();
      return;
    }

    console.log(formData)
    // create asset
    client.management.assets.create(fromAssetForm(formData.asset))
      .then((result) => {
        // get asset id for contract definition
        console.log(result)
        formData.contract.assetsSelector = idSelector(result["@id"]);

        if(publishMode !== PUBLISH_MODE_DO_NOT_PUBLISH.value){
          if(publishMode == PUBLISH_MODE_PUBLISH_RESTRICTED.value){
            // create policy
            client.management.policyDefinitions.create(fromPolicyDefinitionForm(policyExpression, ""))
              .then((result) => {
                formData.contract.accessPolicyId = result["@id"]
                formData.contract.contractPolicyId = result["@id"]

                // create contract
                client.management.contractDefinitions.create(fromContractDefinitionForm(formData.contract))
                  .then(() => {
                    push("/data-offers")
                  })
                  .catch(error => enqueueSnackbar(translator("common.errorOccurred")));
              })
              .catch(error => enqueueSnackbar(translator("common.errorOccurred")));
          }else{
            formData.contract.accessPolicyId = "always-true"
            formData.contract.contractPolicyId = "always-true"

            // create contract
            client.management.contractDefinitions.create(fromContractDefinitionForm(formData.contract))
              .then(() => {
                push("/data-offers")
              })
              .catch(error => enqueueSnackbar(translator("common.errorOccurred")));
          }          
        }
      })
      .catch(error => enqueueSnackbar(translator("common.errorOccurred")));
  };

  const onFormSubmitFail = (error: Error) => {
    enqueueSnackbar(translator("assets.new.saveFail"));
  }

  const dataOfferTypeIsDataSource = formData.asset.dataAddress.type !== DataAddressTypes.MDSOnRequestOffer;

  if (!connector) {
    return "No connector";
  }

  return (
    <SideDrawer title={<T string="dataOffer.new.title" />}>
      <form
        onSubmit={onSubmit}
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
                <AssetFormDataAddressStep
                  translator={translator}
                  formData={formData.asset.dataAddress}
                  onChange={dataAddressFormOnChange}
                  errors={errors.dataAddress}
                  methodAlwaysShowing
                  customDataSourceConfigRows={6}
                />
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
                    hideLabel
                    formData={formData.asset.properties}
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
                    hideLabel
                    formData={formData.asset.properties}
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
                    formData={formData.asset.properties}
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
                    formData={formData.asset.properties}
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
                      hideLabel
                      formData={formData.asset.properties}
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
                      formData={formData.asset.properties}
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
                  formData={formData.asset.properties}
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
                      formData={formData.asset.properties}
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
                      formData={formData.asset.properties}
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
                      formData={formData.asset.properties}
                      errors={errors.properties}
                      onChange={generalInfoFormOnChange}
                      translator={translator}
                    />
                  </div>

                  <div>
                    <AssetContentType
                      formData={formData.asset.properties}
                      errors={errors.properties}
                      onChange={generalInfoFormOnChange}
                    />
                  </div>

                  <div>
                    <AssetDataSamples
                      translator={translator}
                      formData={formData.asset.properties}
                      onChange={advancedInfoFormOnChange}
                      errors={errors.advancedInfo}
                    />
                  </div>

                  <div>
                    <AssetReferenceFileUrls
                      translator={translator}
                      formData={formData.asset.properties}
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
                    formData={formData.asset.properties}
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
                      formData={formData.asset.properties}
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
                      formData={formData.asset.properties}
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
                      formData={formData.asset.properties}
                      onChange={advancedInfoFormOnChange}
                      errors={errors.advancedInfo}
                    />
                  </div>

                  <div>
                    <AssetNutsLocations
                      translator={translator}
                      formData={formData.asset.properties}
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
                      formData={formData.asset.properties}
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
                      formData={formData.asset.properties}
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
                      formData={formData.asset.properties}
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
                      formData={formData.asset.properties}
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
                  name="data-offer-type"
                  id="data-offer-type"
                  label={<T string="dataOffer.new.type"/>}
                  defaultValue={PUBLISH_MODE_PUBLISH_UNRESTRICTED.value}
                  options={PUBLISH_MODES}
                  onChange={(value) => {
                    setPublishMode(value)
                  }}
                />
                {publishMode !== PUBLISH_MODE_PUBLISH_RESTRICTED.value ? "" : <div>
                  <label
                    className="inline-block text-sm text-black font-medium mb-2"
                  >
                    <T string="dataOffer.new.policyExpression"/>
                  </label>
                  <PolicyExpression
                    value={policyExpression}
                    onChange={(value) => { policyExpressionFormOnChange(value) }}
                  />
                </div>
                }
              </div>
            </div>
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
              <T string="dataOffer.new.publish"/>
            </Button>
          </div>
        </div>

      </form>
    </SideDrawer>
  );
}
