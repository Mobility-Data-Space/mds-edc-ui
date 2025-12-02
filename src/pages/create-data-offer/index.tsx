import RadioButtonsGroup from "@/components/atoms/radio-group";
import { AssetConditionsForUse } from "@/components/molecules/asset-conditions-for-use";
import { AssetContentType } from "@/components/molecules/asset-content-type";
import { AssetDataCategoryAndSubcategory } from "@/components/molecules/asset-data-category-and-subcategory";
import { AssetDataModel } from "@/components/molecules/asset-data-model";
import { AssetDataSamples } from "@/components/molecules/asset-data-samples";
import { AssetDataUpdateFrequency } from "@/components/molecules/asset-data-update-frequency";
import { AssetDescription } from "@/components/molecules/asset-description";
import { AssetEndpointDocumentation } from "@/components/molecules/asset-endpoint-documentation";
import { AssetGeoLocations } from "@/components/molecules/asset-geo-locations";
import { AssetGeoReferenceMethod } from "@/components/molecules/asset-geo-reference-method";
import { AssetId } from "@/components/molecules/asset-id";
import { AssetKeywords } from "@/components/molecules/asset-keywords";
import { AssetLanguage } from "@/components/molecules/asset-language";
import { AssetNutsLocations } from "@/components/molecules/asset-nuts-locations";
import { AssetPublisher } from "@/components/molecules/asset-publisher";
import { AssetReferenceFileUrls } from "@/components/molecules/asset-reference-file-urls";
import { AssetSovereignLegalName } from "@/components/molecules/asset-sovereign-legal-name";
import { AssetStandardLicense } from "@/components/molecules/asset-standard-license";
import { AssetTemporalCoverage } from "@/components/molecules/asset-temporal-coverage";
import { AssetTitle } from "@/components/molecules/asset-title";
import { AssetTransportMode } from "@/components/molecules/asset-transport-mode";
import { AssetVersion } from "@/components/molecules/asset-version";
import { Snackbar } from "@/components/molecules/snackbar";
import { FormDataAddressStep } from "@/components/organisms/form-data-address-step";
import PolicyExpression from "@/components/organisms/policy-expression";
import SideDrawer from "@/components/organisms/side-drawer";
import {
  PUBLISH_MODE_DO_NOT_PUBLISH,
  PUBLISH_MODE_PUBLISH_RESTRICTED,
  PUBLISH_MODE_PUBLISH_UNRESTRICTED,
  PUBLISH_MODES,
} from "@/constants/data-address-types";
import { proxyConnectorManagement } from "@/constants/proxy";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import {
  ASSET_ADVANCED_INFO_DATA_CATEGORY,
  ASSET_ADVANCED_INFO_DATA_MODEL,
  ASSET_ADVANCED_INFO_DATA_MODEL_SCHEMA,
  ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS,
  ASSET_ADVANCED_INFO_MOBILITY_THEME,
  ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS,
  ASSET_TITLE,
  ASSET_VERSION,
} from "@/jsonld/asset";
import { UNRESTRICTED_POLICY_ID } from "@/jsonld/policy";
import {
  AssetProperties,
  defaultCreateAssetFormData,
  fromAssetForm,
  generateId,
  validateAdvancedInfo,
  validateDataAddress,
} from "@/utilities/asset";
import {
  defaultCreateContractDefinitionFormData,
  fromContractDefinitionForm,
  MdsContractDefinitionInput,
  createDefaultContractDefinitionFormData,
} from "@/utilities/contract-definition";
import { idSelector } from "@/utilities/data-offer.ts";
import {
  defaultCreatePolicyFormData,
  fromPolicyDefinitionForm,
} from "@/utilities/policy";
import {
  isAndConstraint,
  isAtomicConstraint,
  isOrConstraint,
  isXoneConstraint,
  MultiplicityConstraint,
} from "@/utilities/policy-constraints";
import {
  Button,
  Checkbox as MuiCheckbox,
  Divider,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { Checkbox } from "@/components/atoms/checkbox";
import {
  AssetInput,
  AtomicConstraint,
  DataAddress,
  PolicyDefinitionInput,
} from "@think-it-labs/edc-connector-client";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/use-edc-connector";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGenerateNextContractDefinitionId } from "@/hooks/use-generate-next-contract-definition-id";
import { isUrl } from "@/utilities/utilities";

interface DataOffer {
  asset: AssetInput;
  policy: PolicyDefinitionInput;
  contract: MdsContractDefinitionInput;
}

export default function CreateDataOfferPage() {
  const { push, connector } = useParticipantConnectorState();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const { translator } = useTranslator();

  const [existingIds, setExistingIds] = useState<string[]>([]);
  const [existingContractIds, setExistingContractIds] = useState<string[]>([]);

  const [formData, setFormData] = useState<DataOffer>({
    asset: defaultCreateAssetFormData,
    policy: defaultCreatePolicyFormData,
    contract: defaultCreateContractDefinitionFormData,
  });

  const [policyExpression, setPolicyExpression] = useState<
    (AtomicConstraint | MultiplicityConstraint)[]
  >([]);
  const [publishMode, setPublishMode] = useState(
    PUBLISH_MODE_PUBLISH_UNRESTRICTED.value as string,
  );

  const [errors, setErrors] = useState({
    properties: {},
    advancedInfo: {},
    dataAddress: {},
  });
  const client = useEdcConnectorClient({
    management: proxyConnectorManagement,
  });

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  useEffect(() => {
    client.management.assets
      .queryAll({ offset: 0 })
      .then((assets) => setExistingIds(assets.map((asset) => asset["@id"])));

    client.management.contractDefinitions
      .queryAll({ offset: 0 })
      .then((contracts) =>
        setExistingContractIds(contracts.map((contract) => contract["@id"])),
      );
  }, [client, setExistingIds, setExistingContractIds]);

  const { nextId, error: generateIdError } =
    useGenerateNextContractDefinitionId();

  // Update contract ID when existing contracts are loaded
  useEffect(() => {
    console.log("updating because nextId changed: ", nextId);
    if (generateIdError) {
      enqueueSnackbar("", {
        content: (key) => (
          <Snackbar
            type="error"
            message={translator("contractDefinitions.failedToFetch")}
            onClose={() => {
              closeSnackbar(key);
            }}
          />
        ),
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      contract: createDefaultContractDefinitionFormData(nextId),
    }));
  }, [nextId, generateIdError]);

  const generalInfoIsNotValid = () => {
    return (
      0 < Object.entries(validateGeneralInfo(formData.asset.properties)).length
    );
  };

  const advancedInfoIsNotValid = () => {
    return (
      0 < Object.entries(validateAdvancedInfo(formData.asset.properties)).length
    );
  };

  const dataAddressIsNotValid = () => {
    return (
      0 <
      Object.entries(
        validateDataAddress(formData.asset.dataAddress, translator),
      ).length
    );
  };

  const policyExpressionIsNotValid = useCallback(
    (policyExpression: (AtomicConstraint | MultiplicityConstraint)[]) => {
      if (publishMode !== PUBLISH_MODE_PUBLISH_RESTRICTED.value) {
        return false;
      }

      return policyExpression.some((policy): boolean => {
        if (isAtomicConstraint(policy)) {
          return !policy.rightOperand;
        }

        if (isOrConstraint(policy)) {
          return !policy.or.length || policyExpressionIsNotValid(policy.or);
        }

        if (isAndConstraint(policy)) {
          return !policy.and.length || policyExpressionIsNotValid(policy.and);
        }

        if (isXoneConstraint(policy)) {
          return !policy.xone.length || policyExpressionIsNotValid(policy.xone);
        }

        return false;
      });
    },
    [publishMode],
  );

  const cannotSubmit = () => {
    return (
      generalInfoIsNotValid() ||
      advancedInfoIsNotValid() ||
      dataAddressIsNotValid() ||
      policyExpressionIsNotValid(policyExpression)
    );
  };

  const onChange = (newFormData: DataOffer) => {
    setFormData({ ...newFormData });
  };

  const generalInfoFormOnChange = (generalInfoFormData: AssetProperties) => {
    setErrors((oldErrors) => ({
      ...oldErrors,
      properties: validateGeneralInfo(generalInfoFormData),
    }));

    const generatedOldId = generateId(
      formData.asset.properties[ASSET_TITLE] as string,
      formData.asset.properties[ASSET_VERSION] as string,
    );
    if (generatedOldId === generalInfoFormData["@id"]) {
      generalInfoFormData["@id"] = generateId(
        generalInfoFormData[ASSET_TITLE] as string,
        generalInfoFormData[ASSET_VERSION] as string,
      );
    }

    return onChange({
      ...formData,
      asset: {
        ...formData.asset,
        properties: generalInfoFormData,
        ["@id"]: generalInfoFormData["@id"],
      },
    });
  };

  const dataAddressFormOnChange = (dataAddressFormData: DataAddress) => {
    setErrors((oldErrors) => ({
      ...oldErrors,
      dataAddress: validateDataAddress(dataAddressFormData, translator),
    }));

    return onChange({
      ...formData,
      asset: { ...formData.asset, dataAddress: dataAddressFormData },
    });
  };

  const advancedInfoFormOnChange = (advancedInfoFormData: AssetProperties) => {
    setErrors((oldErrors) => ({
      ...oldErrors,
      advancedInfo: validateAdvancedInfo(advancedInfoFormData),
    }));

    return onChange({
      ...formData,
      asset: { ...formData.asset, properties: advancedInfoFormData },
    });
  };

  const policyExpressionFormOnChange = (
    policy: (AtomicConstraint | MultiplicityConstraint)[],
  ) => {
    return setPolicyExpression(policy);
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
    if (!/^[^\s:]*$/.test(formDataToValidate["@id"])) {
      newErrors["@id"] = translator("assets.new.invalidWhitespacesOrColons");
    } else if (idAlreadyExist) {
      newErrors["@id"] = translator("assets.new.fieldIdAlreadyExists");
    }

    return newErrors;
  };

  const setFormErrors = () => {
    return {
      properties: validateGeneralInfo(formData.asset.properties),
      advancedInfo: validateAdvancedInfo(formData.asset.properties),
      dataAddress: validateDataAddress(formData.asset.dataAddress, translator),
    };
  };

  const onSubmit = () => {
    if (cannotSubmit()) {
      setFormErrors();
      return;
    }

    // create asset
    client.management.assets
      .create(fromAssetForm(formData.asset, connector.curatorName))
      .then((result) => {
        // get asset id for contract definition
        formData.contract.assetsSelector = idSelector(result["@id"]);

        console.log({ publishMode });

        if (publishMode === PUBLISH_MODE_DO_NOT_PUBLISH.value) {
          return;
        }

        if (publishMode === PUBLISH_MODE_PUBLISH_RESTRICTED.value) {
          // create policy
          client.management.policyDefinitions
            .create(fromPolicyDefinitionForm(policyExpression, ""))
            .then((result) => {
              formData.contract.accessPolicyId = result["@id"];
              formData.contract.contractPolicyId = result["@id"];

              // create contract
              client.management.contractDefinitions
                .create(fromContractDefinitionForm(formData.contract))
                .catch((error) =>
                  enqueueSnackbar(translator("common.errorOccurred")),
                );
            })
            .catch((error) =>
              enqueueSnackbar(translator("common.errorOccurred")),
            );
        } else {
          formData.contract.accessPolicyId = UNRESTRICTED_POLICY_ID;
          formData.contract.contractPolicyId = UNRESTRICTED_POLICY_ID;

          console.log({ formData });

          console.log(
            "fromContractDefinitionForm result :",
            fromContractDefinitionForm(formData.contract),
          );

          // create contract
          client.management.contractDefinitions
            .create(fromContractDefinitionForm(formData.contract))
            .catch((error) => {
              console.log("failed to create", error);
              enqueueSnackbar(translator("common.errorOccurred"));
            });
        }
      })
      .then(() => {
        enqueueSnackbar("", {
          content: (key) => (
            <Snackbar
              type="success"
              message={
                publishMode === PUBLISH_MODE_DO_NOT_PUBLISH.value
                  ? translator("dataOffer.new.assetCreateSuccess")
                  : translator("dataOffer.new.dataOfferCreateSuccess")
              }
              onClose={() => {
                closeSnackbar(key);
              }}
            />
          ),
        });
        setTimeout(
          () =>
            push(
              publishMode === PUBLISH_MODE_DO_NOT_PUBLISH.value
                ? "/assets"
                : "/data-offers",
            ),
          2000,
        );
      })
      .catch(() =>
        enqueueSnackbar("", {
          content: (key) => (
            <Snackbar
              type="error"
              message={translator("dataOffer.new.dataOfferCreateError")}
              onClose={() => {
                closeSnackbar(key);
              }}
            />
          ),
        }),
      );
  };

  if (!connector) {
    return "No connector";
  }

  return (
    <SideDrawer title={<T string="dataOffer.new.title" />}>
      <form data-testid="create-data-offer-form" onSubmit={onSubmit}>
        <div className="flex flex-col gap-y-12">
          <div className="flex flex-col gap-y-5 ">
            <div className="grid sm:grid-cols-3 gap-2 sm:gap-6">
              <div className="sm:col-span-1">
                <label className="inline-block text-sm text-black mt-2.5">
                  <Typography variant="h6">
                    <T string="dataOffer.new.dataOfferTypeTitle" />
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <T string="dataOffer.new.dataOfferTypeDescription" />
                  </Typography>
                </label>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-6">
                <FormDataAddressStep
                  translator={translator}
                  formData={formData.asset.dataAddress}
                  onChange={dataAddressFormOnChange}
                  errors={errors.dataAddress}
                  customDataAddressConfigRows={6}
                />
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
                    <T string="assets.new.fieldId" /> *
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
                    <T string="assets.new.fieldDescription" />
                  </label>
                  <AssetDescription
                    formData={formData.asset.properties}
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
                    formData={formData.asset.properties}
                    errors={errors.properties}
                    onChange={generalInfoFormOnChange}
                    translator={translator}
                  />
                </div>

                <FormControlLabel
                  label={<T string="dataOffer.new.showAdvancedFields" />}
                  control={
                    <MuiCheckbox
                      color="secondary"
                      checked={showAdvancedFields}
                      onChange={() => setShowAdvancedFields((value) => !value)}
                    />
                  }
                />

                {!showAdvancedFields ? (
                  ""
                ) : (
                  <>
                    <div>
                      <label
                        htmlFor="properties-version"
                        className="inline-block text-sm text-black font-medium mb-2"
                      >
                        <T string="assets.new.fieldVersion" />
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
                        <T string="assets.new.fieldLanguage" />
                      </label>
                      <AssetLanguage
                        formData={formData.asset.properties}
                        errors={errors.properties}
                        onChange={generalInfoFormOnChange}
                      />
                    </div>
                  </>
                )}
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
                  formData={formData.asset.properties}
                  onChange={advancedInfoFormOnChange}
                  errors={errors.advancedInfo}
                />

                {!showAdvancedFields ? (
                  ""
                ) : (
                  <>
                    <div>
                      <label
                        htmlFor="advanced-info-geo-reference-method"
                        className="inline-block text-sm text-black font-medium mb-2"
                      >
                        <T string="assets.new.fieldAdvancedInfoTransportMode" />
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
                        <T string="assets.new.fieldAdvancedInfoDataModel" />
                      </label>
                      <AssetDataModel
                        translator={translator}
                        formData={formData.asset.properties}
                        onChange={advancedInfoFormOnChange}
                        errors={errors.advancedInfo}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>

            {!showAdvancedFields ? (
              ""
            ) : (
              <>
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
                        <T string="assets.new.fieldEndpointDocumentationPlaceholder" />
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
                      formData={formData.asset.properties}
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
                        <T string="assets.new.fieldAdvancedInfoGeoReferenceMethod" />
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
                        <T string="assets.new.fieldAdvancedGeoLocation" />
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
                        <T string="assets.new.fieldPublisher" />
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
                        <T string="assets.new.fieldStandardLicense" />
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
                        <T string="assets.new.fieldAdvancedInfoConditionsForUse" />
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
              </>
            )}

            <Divider />

            <div className="grid sm:grid-cols-3 gap-2 sm:gap-6">
              <div className="sm:col-span-1">
                <label
                  htmlFor="id"
                  className="inline-block text-sm text-black mt-2.5"
                >
                  <Typography variant="h6">
                    <T string="dataOffer.new.dataOfferPublishingTitle" />
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <T string="dataOffer.new.dataOfferPublishingDescription" />
                  </Typography>
                </label>
              </div>
              <div className="sm:col-span-2 flex flex-col gap-6">
                <RadioButtonsGroup
                  name="data-offer-type"
                  label={<T string="dataOffer.new.type" />}
                  defaultValue={PUBLISH_MODE_PUBLISH_UNRESTRICTED.value}
                  value={publishMode}
                  options={PUBLISH_MODES}
                  onChange={(value) => {
                    setPublishMode(value);
                  }}
                />
                {publishMode !== PUBLISH_MODE_PUBLISH_RESTRICTED.value ? (
                  ""
                ) : (
                  <div>
                    <label className="inline-block text-sm text-black font-medium mb-2">
                      <T string="dataOffer.new.policyExpression" />
                    </label>
                    <PolicyExpression
                      value={policyExpression}
                      onChange={(value) => {
                        policyExpressionFormOnChange(value);
                      }}
                    />
                  </div>
                )}
                {publishMode === PUBLISH_MODE_DO_NOT_PUBLISH.value ? (
                  ""
                ) : (
                  <>
                    <div className="sm:col-span-1">
                      <label className="inline-block text-sm text-black font-medium">
                        {<T string="dataOffer.new.negotiationType" />}
                      </label>
                    </div>
                    <Checkbox
                      label={translator(
                        "contractDefinitions.new.manualApproval",
                      )}
                      value={formData.contract.privateProperties.manualApproval}
                      onChange={(event) => {
                        onChange({
                          ...formData,
                          asset: {
                            ...formData.asset,
                            properties: {
                              ...formData.asset.properties,
                              additionalProperties: {
                                manual_approval:
                                  event.target.checked.toString(),
                              },
                            },
                          },
                          contract: {
                            ...formData.contract,
                            privateProperties: {
                              manualApproval: event.target.checked,
                            },
                          },
                        });
                      }}
                    />
                  </>
                )}
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
              <T string="dataOffer.new.publish" />
            </Button>
          </div>
        </div>
      </form>
    </SideDrawer>
  );
}
