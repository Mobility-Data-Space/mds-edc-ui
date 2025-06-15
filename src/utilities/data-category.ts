import {DATA_CATEGORY_SELECT_DATA, DATA_SUBCATEGORIES_DATA} from "@/constants/data-category.ts";

export const dataCategoryValueToText = (categoryValue: string) => {
  return DATA_CATEGORY_SELECT_DATA.find(
    category => category.value === categoryValue
    )?.text
    || categoryValue;
}

export const dataSubCategoryValueToText = (categoryValue: string, subCategoryValue: string) => {
  return (DATA_SUBCATEGORIES_DATA[categoryValue] || []).find(
    subCategory => subCategory.value === subCategoryValue
  )?.text
    || subCategoryValue;
}
