import React, { useState } from "react";

import { Checkbox, Divider, FormControlLabel } from "@mui/material";

import { AssetDataCategoryAndSubcategory } from "@/components/molecules/asset-data-category-and-subcategory";
import { AssetDataSamples } from "@/components/molecules/asset-data-samples";
import { AssetId } from "@/components/molecules/asset-id";
import { AssetKeywords } from "@/components/molecules/asset-keywords";
import { AssetLanguage } from "@/components/molecules/asset-language";
import { AssetNutsLocations } from "@/components/molecules/asset-nuts-locations";
import { AssetReferenceFileUrls } from "@/components/molecules/asset-reference-file-urls";
import { AssetTemporalCoverage } from "@/components/molecules/asset-temporal-coverage";
import { ASSET_TEXT_FIELDS, AssetTextField, AssetTextFieldName } from "@/components/molecules/asset-text-field";
import { AssetTransportMode } from "@/components/molecules/asset-transport-mode";
import { FormSection, LabelledField } from "@/components/molecules/form-section";
import type { AssetForm } from "@/hooks/use-asset-form";
import { T, useTranslator } from "@/i18n";

interface AssetFormSectionsProps {
  form: AssetForm;
  idDisabled?: boolean;
}

// The asset metadata part of the create-data-offer and edit-asset pages.
export function AssetFormSections({ form, idDisabled = false }: AssetFormSectionsProps): React.ReactElement {
  const { translator } = useTranslator();
  const [showAdvancedFields, setShowAdvancedFields] = useState(false);
  const { asset, errors, isCheckingId, onGeneralInfoChange, onAdvancedInfoChange } = form;

  const generalInfoProps = { translator, formData: asset.properties, onChange: onGeneralInfoChange, errors: errors.properties };
  const advancedInfoProps = { translator, formData: asset.properties, onChange: onAdvancedInfoChange, errors: errors.advancedInfo };

  const textField = (field: AssetTextFieldName, fieldProps: typeof generalInfoProps, required = false) => (
    <LabelledField htmlFor={ASSET_TEXT_FIELDS[field].id} labelKey={ASSET_TEXT_FIELDS[field].labelKey} required={required}>
      <AssetTextField field={field} hideLabel {...fieldProps} />
    </LabelledField>
  );

  return (
    <>
      <FormSection titleKey="dataOffer.new.dataOfferGeneralInfoTitle" descriptionKey="dataOffer.new.dataOfferGeneralInfoDescription">
        {textField("title", generalInfoProps, true)}
        <LabelledField htmlFor="properties-id" labelKey="assets.new.fieldId" required>
          <AssetId hideLabel disabled={idDisabled} loading={isCheckingId} {...generalInfoProps} />
        </LabelledField>
        {textField("description", generalInfoProps)}
        <LabelledField htmlFor="properties-keywords" labelKey="assets.new.fieldKeywords">
          <AssetKeywords {...generalInfoProps} />
        </LabelledField>

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

        {showAdvancedFields && (
          <>
            {textField("version", generalInfoProps)}
            <LabelledField htmlFor="properties-language" labelKey="assets.new.fieldLanguage">
              <AssetLanguage {...generalInfoProps} />
            </LabelledField>
          </>
        )}
      </FormSection>

      <Divider />

      <FormSection titleKey="dataOffer.new.dataOfferMobilityInfoTitle" descriptionKey="dataOffer.new.dataOfferMobilityInfoDescription">
        <AssetDataCategoryAndSubcategory {...advancedInfoProps} />

        {showAdvancedFields && (
          <>
            <LabelledField htmlFor="advanced-info-transport-mode" labelKey="assets.new.fieldAdvancedInfoTransportMode">
              <AssetTransportMode {...advancedInfoProps} />
            </LabelledField>
            {textField("dataModel", advancedInfoProps)}
          </>
        )}
      </FormSection>

      {showAdvancedFields && (
        <>
          <Divider />

          <FormSection titleKey="dataOffer.new.dataOfferDocumentationTitle" descriptionKey="dataOffer.new.dataOfferDocumentationDescription">
            {textField("endpointDocumentation", generalInfoProps)}
            <div>
              <AssetTextField field="contentType" {...generalInfoProps} />
            </div>
            <div>
              <AssetDataSamples {...advancedInfoProps} />
            </div>
            <div>
              <AssetReferenceFileUrls {...advancedInfoProps} />
            </div>
          </FormSection>

          <Divider />

          <FormSection titleKey="dataOffer.new.dataOfferLocationTimeTitle" descriptionKey="dataOffer.new.dataOfferLocationTimeDescription">
            <AssetTemporalCoverage {...advancedInfoProps} />
            {textField("dataUpdateFrequency", advancedInfoProps)}
            {textField("geoReferenceMethod", advancedInfoProps)}
            {textField("geoLocation", advancedInfoProps)}
            <div>
              <AssetNutsLocations {...advancedInfoProps} />
            </div>
          </FormSection>

          <Divider />

          <FormSection titleKey="dataOffer.new.dataOfferLegalInfoTitle" descriptionKey="dataOffer.new.dataOfferLegalInfoDescription">
            {textField("sovereignLegalName", advancedInfoProps)}
            {textField("publisher", generalInfoProps)}
            {textField("standardLicense", generalInfoProps)}
            {textField("conditionsForUse", advancedInfoProps)}
          </FormSection>
        </>
      )}
    </>
  );
}
