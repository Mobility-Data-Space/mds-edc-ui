import RadioButtonsGroup from "@/components/atoms/radio-group";
import { FormSection } from "@/components/molecules/form-section";
import { AssetFormSections } from "@/components/organisms/asset-form-sections";
import { FormDataAddressStep } from "@/components/organisms/form-data-address-step";
import { DATA_OFFER_TYPE_DATA_SOURCE } from "@/constants/data-address-types";
import { proxyConnectorManagement } from "@/constants/proxy";
import { assetToAssetInput, fromAssetForm } from "@/domain/asset/mapper";
import { useAppSnackbar } from "@/hooks/use-app-snackbar";
import { useAssetForm } from "@/hooks/use-asset-form";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { Button, Divider } from "@mui/material";
import { AssetInput } from "@think-it-labs/edc-connector-client";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/use-edc-connector";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const unchangedOfferType = {
  text: "assets.edit.keepDatasourceUnchanged",
  value: "Unchanged",
};

export default function EditAssetPage() {
  const {
    query: { id },
  } = useRouter();
  const [offerType, setOfferType] = useState(unchangedOfferType.value);
  const [oldAssetData, setOldAssetData] = useState({} as AssetInput);
  const { push, connector } = useParticipantConnectorState();
  const client = useEdcConnectorClient({
    management: proxyConnectorManagement,
  });
  const { showSnackbar } = useAppSnackbar();
  const { translator } = useTranslator();

  const form = useAssetForm();
  const { asset, setAsset } = form;

  const onChangeOfferType = (newOfferType: string) => {
    if (newOfferType === unchangedOfferType.value) {
      setAsset({ ...asset, dataAddress: oldAssetData.dataAddress! });
    }
    setOfferType(newOfferType);
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    client.management.assets
      .get(id as string)
      .then(assetToAssetInput)
      .then((assetInput: AssetInput) => {
        setOldAssetData(assetInput);
        setAsset(assetInput);
      });
  }, [client, id, setAsset]);

  const onSubmit = () => {
    if (form.isInvalid()) {
      return;
    }
    client.management.assets
      .update(fromAssetForm(asset, connector?.curatorName ?? ""))
      .then(() => {
        showSnackbar({
          type: "success",
          message: translator("dataOffer.new.assetUpdateSuccess"),
          persist: false,
        });
        setTimeout(() => push("/assets"), 2000);
      })
      .catch(() =>
        showSnackbar({
          type: "error",
          message: translator("assets.new.saveFail"),
          persist: false,
        }),
      );
  };

  if (!connector) {
    return <T string="common.noConnector" />;
  }

  return (
    <form>
      <div className="flex flex-col gap-y-12">
        <div className="flex flex-col gap-y-5">
          <FormSection titleKey="dataOffer.new.dataOfferTypeTitle" descriptionKey="dataOffer.new.dataOfferTypeDescription">
            <RadioButtonsGroup
              name="data-offer-type"
              id="data-offer-type"
              label={<T string="dataOffer.new.type" />}
              value={offerType}
              defaultValue={offerType}
              options={[
                {
                  ...unchangedOfferType,
                  text: translator(unchangedOfferType.text),
                },
                DATA_OFFER_TYPE_DATA_SOURCE,
              ]}
              onChange={onChangeOfferType}
            />
            {offerType !== unchangedOfferType.value && (
              <FormDataAddressStep
                translator={translator}
                formData={asset.dataAddress!}
                onChange={form.onDataAddressChange}
                errors={form.errors.dataAddress}
                customDataAddressConfigRows={6}
              />
            )}
          </FormSection>

          <Divider />

          <AssetFormSections form={form} idDisabled />
        </div>

        <Divider />

        <div className="flex justify-end px-6 py-4">
          <Button
            data-testid="data-offer-create-submit"
            variant="contained"
            onClick={onSubmit}
            disabled={form.isInvalid()}
          >
            <T string="common.update" />
          </Button>
        </div>
      </div>
    </form>
  );
}

EditAssetPage.titleKey = "assets.edit.title";
