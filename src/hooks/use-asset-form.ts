import { proxyConnectorManagement } from "@/constants/proxy";
import { AssetProperties, defaultCreateAssetFormData, generateId } from "@/domain/asset/model";
import { validateAdvancedInfo, validateDataAddress } from "@/domain/asset/validation";
import { useDebounce } from "@/hooks/use-debounce";
import { useValidateGeneralInfo } from "@/hooks/use-validate-general-info";
import { useTranslator } from "@/i18n";
import { ASSET_TITLE, ASSET_VERSION } from "@/jsonld/asset";
import { EDC_ID_FIELD, criterionOperatorEqual } from "@/utilities/data-offer";
import { AssetInput, DataAddress } from "@think-it-labs/edc-connector-client";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/use-edc-connector";
import { useCallback, useMemo, useState } from "react";

type FieldErrors = Record<string, boolean | string>;

export interface AssetFormErrors {
  properties: FieldErrors;
  advancedInfo: FieldErrors;
  dataAddress: FieldErrors;
}

interface UseAssetFormOptions {
  // Keep the id in sync with title and version until the user edits it by hand.
  generateIdFromTitle?: boolean;
  // Look up each new id on the connector and flag ids that are already taken.
  checkIdAvailability?: boolean;
  // Ids known up front to be taken; validated synchronously.
  existingIds?: string[];
  onEdit?: () => void;
}

const hasErrors = (errors: object) => Object.keys(errors).length > 0;

export function useAssetForm({
  generateIdFromTitle = false,
  checkIdAvailability = false,
  existingIds,
  onEdit,
}: UseAssetFormOptions = {}) {
  const { translator } = useTranslator();
  const validateGeneralInfo = useValidateGeneralInfo(existingIds);
  const client = useEdcConnectorClient({ management: proxyConnectorManagement });

  const [asset, setAsset] = useState<AssetInput>(defaultCreateAssetFormData);
  const [errors, setErrors] = useState<AssetFormErrors>({
    properties: {},
    advancedInfo: {},
    dataAddress: {},
  });
  const [idIsTaken, setIdIsTaken] = useState(false);
  const [isCheckingId, setIsCheckingId] = useState(false);

  const checkIdIsTaken = useCallback(
    async (id: string) => {
      if (!id) {
        setIdIsTaken(false);
        setIsCheckingId(false);
        return;
      }
      setIsCheckingId(true);
      try {
        const assets = await client.management.assets.queryAll({
          offset: 0,
          limit: 1,
          filterExpression: [
            { operandLeft: EDC_ID_FIELD, operator: criterionOperatorEqual, operandRight: id },
          ],
        });
        setIdIsTaken(assets.length > 0);
      } catch {
        setIdIsTaken(false);
      } finally {
        setIsCheckingId(false);
      }
    },
    [client],
  );
  const { debounce: debouncedCheckIdIsTaken } = useDebounce(checkIdIsTaken, 500);

  const update = (newAsset: AssetInput) => {
    onEdit?.();
    setAsset({ ...newAsset });
  };

  const onGeneralInfoChange = (properties: AssetProperties) => {
    if (generateIdFromTitle) {
      const previousGeneratedId = generateId(
        asset.properties[ASSET_TITLE] as string,
        asset.properties[ASSET_VERSION] as string,
      );
      if (previousGeneratedId === properties["@id"]) {
        properties["@id"] = generateId(properties[ASSET_TITLE] as string, properties[ASSET_VERSION] as string);
      }
    }

    if (checkIdAvailability && properties["@id"] !== asset["@id"]) {
      setIsCheckingId(true);
      setIdIsTaken(false);
      debouncedCheckIdIsTaken(properties["@id"]);
    }

    setErrors((oldErrors) => ({ ...oldErrors, properties: validateGeneralInfo(properties) }));
    update({ ...asset, properties, ["@id"]: properties["@id"] });
  };

  const onAdvancedInfoChange = (properties: AssetProperties) => {
    setErrors((oldErrors) => ({ ...oldErrors, advancedInfo: validateAdvancedInfo(properties) }));
    update({ ...asset, properties });
  };

  const onDataAddressChange = (dataAddress: DataAddress) => {
    setErrors((oldErrors) => ({ ...oldErrors, dataAddress: validateDataAddress(dataAddress, translator) }));
    update({ ...asset, dataAddress });
  };

  const validateAll = () => {
    const newErrors = {
      properties: validateGeneralInfo(asset.properties),
      advancedInfo: validateAdvancedInfo(asset.properties),
      dataAddress: validateDataAddress(asset.dataAddress, translator),
    };
    setErrors(newErrors);
    return newErrors;
  };

  const isInvalid = () =>
    isCheckingId ||
    idIsTaken ||
    hasErrors(validateGeneralInfo(asset.properties)) ||
    hasErrors(validateAdvancedInfo(asset.properties)) ||
    hasErrors(validateDataAddress(asset.dataAddress, translator));

  const propertiesErrors = useMemo(
    () =>
      idIsTaken
        ? { ...errors.properties, "@id": translator("assets.new.fieldIdAlreadyExists") }
        : errors.properties,
    [errors.properties, idIsTaken, translator],
  );

  return {
    asset,
    setAsset,
    errors: { ...errors, properties: propertiesErrors },
    setErrors,
    isCheckingId,
    validateGeneralInfo,
    onGeneralInfoChange,
    onAdvancedInfoChange,
    onDataAddressChange,
    validateAll,
    isInvalid,
  };
}

export type AssetForm = ReturnType<typeof useAssetForm>;
