import { ASSET_ADVANCED_INFO_TEMPORAL_COVERAGE } from "@/jsonld/asset";

export const removeEmptyFields = (object: { [key: string]: any }) => {
  const newFormData: { [key: string]: any } = {};
  for (const key in object) {
    if (typeof object[key] === "boolean") {
      newFormData[key] = "" + object[key];
      continue;
    }

    if (Array.isArray(object[key])) {
      if (object[key].length > 0) {
        newFormData[key] = object[key];
      }
      continue;
    }

    if (typeof object[key] === "object") {
      newFormData[key] = removeEmptyFields(object[key]);
      continue;
    }

    if (object[key]) {
      newFormData[key] = object[key];
      continue;
    }
  }

  return newFormData;
};
