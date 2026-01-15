
import { MuiSelect } from "@/components/atoms/mui-select";

import { DATA_CATEGORY_SELECT_DATA, DATA_SUBCATEGORIES_DATA, TYPE_DATA_CATEGORY } from "@/constants/data-category";
import { T } from "@/i18n";
import { ASSET_ADVANCED_INFO_DATA_CATEGORY, ASSET_ADVANCED_INFO_DATA_SUBCATEGORY, ASSET_ADVANCED_INFO_MOBILITY_THEME } from "@/jsonld/asset";
import { AssetProperties } from "@/utilities/asset";

export interface AssetDataCategoryAndSubcategoryProps {
  translator: (key: string) => string;
  formData: AssetProperties;
  onChange: (formData: any) => void;
  errors: { [key: string]: boolean };
}

export function AssetDataCategoryAndSubcategory({ translator, formData, onChange, errors }: AssetDataCategoryAndSubcategoryProps): React.ReactElement {
  const labelColor = errors[ASSET_ADVANCED_INFO_DATA_CATEGORY] ? `text-red-500` : "text-gray-800"

  return (
    <>
      <div>
        <label
          htmlFor="advanced-info-data-category"
          className={`block text-sm mb-1 ${labelColor}`}
        >
          <T string="assets.new.fieldAdvancedInfoDataCategory" />
          {"*"}
        </label>
        <MuiSelect
          name={ASSET_ADVANCED_INFO_DATA_CATEGORY}
          id="advanced-info-data-category"
          placeholder={translator("assets.new.fieldAdvancedInfoDataCategoryPlaceholder")}
          options={DATA_CATEGORY_SELECT_DATA}
          value={formData[ASSET_ADVANCED_INFO_MOBILITY_THEME][ASSET_ADVANCED_INFO_DATA_CATEGORY]}
          error={errors[ASSET_ADVANCED_INFO_DATA_CATEGORY]}
          onChange={(event) => onChange({
            ...formData,
            [ASSET_ADVANCED_INFO_MOBILITY_THEME]: {
              ...formData[ASSET_ADVANCED_INFO_MOBILITY_THEME],
              [ASSET_ADVANCED_INFO_DATA_CATEGORY]: event.target.value,
              [ASSET_ADVANCED_INFO_DATA_SUBCATEGORY]: "",
            }
          })}
        />
      </div>

      <div>
        <label
          htmlFor="advanced-info-data-subcategory"
          className="block text-sm text-gray-800 mb-1"
        >
          <T string="assets.new.fieldAdvancedInfoDataSubcategory" />
        </label>
        <MuiSelect
          name={ASSET_ADVANCED_INFO_DATA_SUBCATEGORY}
          id="advanced-info-data-subcategory"
          placeholder={translator("assets.new.fieldAdvancedInfoDataSubcategoryPlaceholder")}
          options={DATA_SUBCATEGORIES_DATA[formData[ASSET_ADVANCED_INFO_MOBILITY_THEME][ASSET_ADVANCED_INFO_DATA_CATEGORY] as TYPE_DATA_CATEGORY] || []}
          value={formData[ASSET_ADVANCED_INFO_MOBILITY_THEME][ASSET_ADVANCED_INFO_DATA_SUBCATEGORY]}
          error={errors[ASSET_ADVANCED_INFO_DATA_SUBCATEGORY]}
          onChange={(event) => onChange({
            ...formData,
            [ASSET_ADVANCED_INFO_MOBILITY_THEME]: {
              ...formData[ASSET_ADVANCED_INFO_MOBILITY_THEME],
              [ASSET_ADVANCED_INFO_DATA_SUBCATEGORY]: event.target.value,
            }
          })}
        />
      </div>
    </>
  );
}
