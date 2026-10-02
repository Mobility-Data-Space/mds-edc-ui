import { useTranslator } from "@/i18n";
import { ASSET_ENDPOINT_DOCUMENTATION, ASSET_TITLE } from "@/jsonld/asset";
import { isUrl } from "@/utilities/utilities";
import { useCallback } from "react";
import { AssetProperties } from "@/domain/asset/model";

export const useValidateGeneralInfo = (existingAssetIds?: string[]) => {
  const { translator } = useTranslator();

  const validate = useCallback(
    (formDataToValidate: AssetProperties) => {
      const newErrors: { [key: string]: boolean | string } = {};
      const required_properties = [ASSET_TITLE, "@id"];
      required_properties.forEach((propertyName) => {
        if (!formDataToValidate[propertyName]) {
          newErrors[propertyName] = true;
        }
      });

      const endpointDocumentation =
        formDataToValidate[ASSET_ENDPOINT_DOCUMENTATION];
      if (endpointDocumentation && !isUrl(endpointDocumentation)) {
        newErrors[ASSET_ENDPOINT_DOCUMENTATION] = translator(
          "assets.new.mustBeValidUrl",
        );
      }

      if (typeof existingAssetIds === "undefined") return newErrors;

      const idAlreadyExist = existingAssetIds.includes(
        formDataToValidate["@id"],
      );
      if (!/^[^\s:]*$/.test(formDataToValidate["@id"])) {
        newErrors["@id"] = translator("assets.new.invalidWhitespacesOrColons");
      } else if (idAlreadyExist) {
        newErrors["@id"] = translator("assets.new.fieldIdAlreadyExists");
      }

      return newErrors;
    },
    [translator, existingAssetIds],
  );

  return validate;
};
