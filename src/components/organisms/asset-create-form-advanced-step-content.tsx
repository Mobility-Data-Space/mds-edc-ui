import React from "react";
import {T} from "@/i18n";
import {Input} from "../atoms/input.tsx";
import {MuiSelect} from "../atoms/mui-select.tsx";
import {
  ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE,
  ASSET_ADVANCED_INFO_DATA_CATEGORY,
  ASSET_ADVANCED_INFO_DATA_MODEL,
  ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS,
  ASSET_ADVANCED_INFO_DATA_SUBCATEGORY,
  ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY,
  ASSET_ADVANCED_INFO_GEO_LOCATION,
  ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD,
  ASSET_ADVANCED_INFO_NUTS_LOCATIONS,
  ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION,
  ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS,
  ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME,
  ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE,
  ASSET_ADVANCED_INFO_TRANSPORT_MODE,
  CreateAssetAdvancedInfoFormData,
} from "@/schema/asset.ts";
import {
  DATA_CATEGORY_SELECT_DATA,
  DATA_GEO_REFERENCE_DATA,
  DATA_SUBCATEGORIES_DATA, TYPE_DATA_CATEGORY
} from "@/constants/data-category.ts";
import {KeyValuePairInputList} from "@/components/molecules/key-value-pair-input-list.tsx";
import {FormHelperText, IconButton, Link, Tooltip} from "@mui/material";
import {InfoOutlined} from "@mui/icons-material";
import DateRangePicker from "@/components/molecules/date-range-picker.tsx";

export interface AssetCreateFormAdvancedInfoStepProps {
  translator: (key: string) => string;
  formData: CreateAssetAdvancedInfoFormData
  onChange: (formData: any) => void;
  errors: { [key: string]: boolean };
}

export function AssetCreateFormAdvancedInfoStepContent({ translator, formData, onChange, errors }: AssetCreateFormAdvancedInfoStepProps): JSX.Element {

  return (
    <div className="flex flex-col gap-y-5">
      <div className="grid sm:grid-cols-2 gap-2 w-full">
        <div>
          <label
            htmlFor="advanced-info-data-category"
            className="block text-sm text-gray-800 mb-1"
          >
            <T string="assets.new.fieldAdvancedInfoDataCategory"/>
          </label>
          <MuiSelect
            name={ASSET_ADVANCED_INFO_DATA_CATEGORY}
            id="advanced-info-data-category"
            required
            placeholder={translator("assets.new.fieldAdvancedInfoDataCategoryPlaceholder")}
            options={DATA_CATEGORY_SELECT_DATA}
            value={formData[ASSET_ADVANCED_INFO_DATA_CATEGORY]}
            error={errors[ASSET_ADVANCED_INFO_DATA_CATEGORY]}
            onChange={(event) => onChange({ ...formData, [ASSET_ADVANCED_INFO_DATA_CATEGORY]: event.target.value, [ASSET_ADVANCED_INFO_DATA_SUBCATEGORY]: "" })}
          />
        </div>

        <div>
          <label
            htmlFor="advanced-info-data-category"
            className="block text-sm text-gray-800 mb-1"
          >
            <T string="assets.new.fieldAdvancedInfoDataSubcategory"/>
          </label>
          <MuiSelect
            name={ASSET_ADVANCED_INFO_DATA_SUBCATEGORY}
            id="advanced-info-data-category"
            placeholder={translator("assets.new.fieldAdvancedInfoDataSubcategoryPlaceholder")}
            options={DATA_SUBCATEGORIES_DATA[formData[ASSET_ADVANCED_INFO_DATA_CATEGORY] as TYPE_DATA_CATEGORY] || []}
            value={formData[ASSET_ADVANCED_INFO_DATA_SUBCATEGORY]}
            error={errors[ASSET_ADVANCED_INFO_DATA_SUBCATEGORY]}
            onChange={(event) => onChange({...formData, [ASSET_ADVANCED_INFO_DATA_SUBCATEGORY]: event.target.value})}
          />
        </div>
      </div>

      <div>
        <Input
          name={ASSET_ADVANCED_INFO_DATA_MODEL}
          id="advanced-transport-mode"
          type="text"
          label={<T string="assets.new.fieldAdvancedInfoDataModel"/>}
          placeholder={translator("assets.new.fieldAdvancedInfoDataModelPlaceholder")}
          tooltip={translator("assets.new.fieldAdvancedInfoDataModelTooltip")}
          value={formData[ASSET_ADVANCED_INFO_DATA_MODEL]}
          error={errors[ASSET_ADVANCED_INFO_DATA_MODEL]}
          onChange={(event) => onChange({...formData, [ASSET_ADVANCED_INFO_DATA_MODEL]: event.target.value})}
        />
      </div>

      <div className="grid sm:grid-cols-16 gap-2 w-full">
        <div className="sm:col-span-9">
          <label
            htmlFor="advanced-info-geo-reference-method"
            className="block text-sm text-gray-800 mb-1"
          >
            <T string="assets.new.fieldAdvancedInfoTransportMode"/>
          </label>
          <MuiSelect
            name={ASSET_ADVANCED_INFO_TRANSPORT_MODE}
            id="advanced-info-transport-mode"
            options={DATA_GEO_REFERENCE_DATA}
            placeholder={translator("assets.new.fieldAdvancedInfoTransportModePlaceholder")}
            value={formData[ASSET_ADVANCED_INFO_TRANSPORT_MODE]}
            error={errors[ASSET_ADVANCED_INFO_TRANSPORT_MODE]}
            onChange={(event) => onChange({
              ...formData,
              [ASSET_ADVANCED_INFO_TRANSPORT_MODE]: event.target.value
            })}
          />
        </div>

        <div className="sm:col-span-7 content-end">
          <Input
            name={ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD}
            id="advanced-info-geo-reference-method"
            type="text"
            label={<T string="assets.new.fieldAdvancedInfoGeoReferenceMethod"/>}
            placeholder={translator("assets.new.fieldAdvancedInfoGeoReferenceMethodPlaceholder")}
            tooltip={translator("assets.new.fieldAdvancedInfoGeoReferenceMethodTooltip")}
            value={formData[ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD]}
            error={errors[ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD]}
            onChange={(event) => onChange({...formData, [ASSET_ADVANCED_INFO_GEO_REFERENCE_METHOD]: event.target.value})}
          />
        </div>
      </div>

      <div>
        <Input
          name={ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME}
          id="advanced-sovereign-legal-name"
          type="text"
          label={<T string="assets.new.fieldAdvancedInfoSovereignLegalName"/>}
          placeholder={translator("assets.new.fieldAdvancedInfoSovereignLegalNamePlaceholder")}
          tooltip={translator("assets.new.fieldAdvancedInfoSovereignLegalNameTooltip")}
          value={formData[ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME]}
          error={errors[ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME]}
          onChange={(event) => onChange({...formData, [ASSET_ADVANCED_INFO_SOVEREIGN_LEGAL_NAME]: event.target.value})}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-2 w-full">
        <Input
          name={ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY}
          id="advanced-data-update-frequency"
          type="text"
          label={<T string="assets.new.fieldAdvancedDataUpdateFrequency"/>}
          placeholder={translator("assets.new.fieldAdvancedDataUpdateFrequencyPlaceholder")}
          tooltip={translator("assets.new.fieldAdvancedDataUpdateFrequencyTooltip")}
          value={formData[ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY]}
          error={errors[ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY]}
          onChange={(event) => onChange({...formData, [ASSET_ADVANCED_INFO_DATA_UPDATE_FREQUENCY]: event.target.value})}
        />

        <Input
          name={ASSET_ADVANCED_INFO_GEO_LOCATION}
          id="advanced-geo-location"
          type="text"
          label={<T string="assets.new.fieldAdvancedGeoLocation"/>}
          placeholder={"40.741895,-73.989308"}
          tooltip={translator("assets.new.fieldAdvancedGeoLocationTooltip")}
          value={formData[ASSET_ADVANCED_INFO_GEO_LOCATION]}
          error={errors[ASSET_ADVANCED_INFO_GEO_LOCATION]}
          onChange={(event) => onChange({...formData, [ASSET_ADVANCED_INFO_GEO_LOCATION]: event.target.value})}
        />
      </div>

      <div>
        <label
          htmlFor="advanced-info-nuts-locations"
          className="block text-sm text-gray-800 mb-1"
        >
          <T string="assets.new.fieldAdvancedInfoNutsLocation"/>
          <Tooltip
            title={translator("assets.new.fieldAdvancedInfoNutsLocationTooltip")}><IconButton><InfoOutlined/></IconButton></Tooltip>
        </label>

        <KeyValuePairInputList
          name={ASSET_ADVANCED_INFO_NUTS_LOCATIONS}
          id="advanced-info-nuts-locations"
          type="text"
          label={translator("assets.new.fieldAdvancedInfoNutsLocation")}
          addText={translator("assets.new.fieldAdvancedInfoNutsLocationAddText")}
          valueLabel={translator("assets.new.fieldAdvancedInfoNutsLocationValueLabel")}
          valuePlaceholder="DE929"
          error={errors[ASSET_ADVANCED_INFO_NUTS_LOCATIONS]}
          value={formData[ASSET_ADVANCED_INFO_NUTS_LOCATIONS]}
          valueOnly
          onChange={(value) => onChange({...formData, [ASSET_ADVANCED_INFO_NUTS_LOCATIONS]: value})}
        />
      </div>

      <div>
        <label
          htmlFor="advanced-info-data-sample-urls"
          className="block text-sm text-gray-800 mb-1"
        >
          <T string="assets.new.fieldAdvancedInfoDataSampleUrl"/>
          <Tooltip
            title={translator("assets.new.fieldAdvancedInfoDataSampleUrlTooltip")}><IconButton><InfoOutlined/></IconButton></Tooltip>
        </label>

        <KeyValuePairInputList
          name={ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS}
          id="advanced-info-data-sample-urls"
          type="text"
          label={translator("assets.new.fieldAdvancedInfoDataSampleUrl")}
          addText={translator("assets.new.fieldAdvancedInfoDataSampleUrlAddText")}
          valueLabel={translator("assets.new.fieldAdvancedInfoDataSampleUrlValueLabel")}
          valuePlaceholder="https://my-org.com/my-data-offer"
          error={errors[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS]}
          value={formData[ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS]}
          valueOnly
          onChange={(value) => onChange({...formData, [ASSET_ADVANCED_INFO_DATA_SAMPLE_URLS]: value})}
        />
      </div>

      <div>
        <label
          htmlFor="advanced-info-reference-file-urls"
          className="block text-sm text-gray-800 mb-1"
        >
          <T string="assets.new.fieldAdvancedInfoReferenceFileUrls"/>
          <Tooltip
            title={translator("assets.new.fieldAdvancedInfoReferenceFileUrlsTooltip")}><IconButton><InfoOutlined/></IconButton></Tooltip>
        </label>

        <KeyValuePairInputList
          name={ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS}
          id="advanced-info-reference-file-urls"
          type="text"
          label={translator("assets.new.fieldAdvancedInfoReferenceFileUrls")}
          addText={translator("assets.new.fieldAdvancedInfoReferenceFileUrlsAddText")}
          valueLabel={translator("assets.new.fieldAdvancedInfoReferenceFileUrlsValueLabel")}
          valuePlaceholder="https://my-org.com/my-data-offer/documentation/api-reference"
          error={errors[ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS]}
          value={formData[ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS]}
          valueOnly
          onChange={(value) => onChange({...formData, [ASSET_ADVANCED_INFO_REFERENCE_FILE_URLS]: value})}
        />
      </div>

      <div>
        <Input
          name={ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION}
          id="advanced-info-description"
          label={<T string="assets.new.fieldAdvancedInfoReferenceFileDescription"/>}
          placeholder={"..."}
          multiline
          rows={6}
          value={formData[ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION]}
          error={errors[ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION]}
          onChange={(event) => onChange({
            ...formData,
            [ASSET_ADVANCED_INFO_REFERENCE_FILE_DESCRIPTION]: event.target.value
          })}
        />
        <FormHelperText className="flex flex-row gap-x-1">
          <T string="assets.new.fieldAdvancedInfoReferenceFileDescriptionSupport"/>
          <Link href="https://www.markdownguide.org/basic-syntax" target="_blank">
            Markdown syntax
          </Link>
        </FormHelperText>
      </div>

      <div>
        <DateRangePicker
          name={ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE}
          id="advanced-info-temporal-coverage"
          label={<T string="assets.new.fieldAdvancedInfoTemporalCoverage"/>}
          helperText={translator('assets.new.fieldAdvancedInfoTemporalCoverageHelper')}
          onChange={(value) => onChange({
            ...formData,
            [ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE]: value
          })}
          error={errors[ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE]}
          value={formData[ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE]} />
      </div>

      <div>
        <Input
          name={ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE}
          id="advanced-info-conditions-for-use"
          label={<T string="assets.new.fieldAdvancedInfoConditionsForUse"/>}
          placeholder={translator("assets.new.fieldAdvancedInfoConditionsForUsePlaceholder")}
          multiline
          rows={6}
          value={formData[ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE]}
          error={errors[ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE]}
          onChange={(event) => onChange({
            ...formData,
            [ASSET_ADVANCED_INFO_CONDITIONS_FOR_USE]: event.target.value
          })}
        />
        <FormHelperText className="flex flex-row gap-x-1">
          <T string="assets.new.fieldAdvancedInfoConditionsForUseSupport"/>
          <Link href="https://www.markdownguide.org/basic-syntax" target="_blank">
            Markdown syntax
          </Link>
        </FormHelperText>
      </div>
    </div>
  );
}
