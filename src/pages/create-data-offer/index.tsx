import { Checkbox } from "@/components/atoms/checkbox";
import RadioButtonsGroup from "@/components/atoms/radio-group";
import { FormSection } from "@/components/molecules/form-section";
import { AssetFormSections } from "@/components/organisms/asset-form-sections";
import { FormDataAddressStep } from "@/components/organisms/form-data-address-step";
import PolicyExpression from "@/components/organisms/policy-expression";
import {
  PUBLISH_MODE_DO_NOT_PUBLISH,
  PUBLISH_MODE_PUBLISH_RESTRICTED,
  PUBLISH_MODE_PUBLISH_UNRESTRICTED,
  PUBLISH_MODES,
} from "@/constants/data-address-types";
import { proxyConnectorManagement } from "@/constants/proxy";
import { fromAssetForm } from "@/domain/asset/mapper";
import { useAppSnackbar } from "@/hooks/use-app-snackbar";
import { useAssetForm } from "@/hooks/use-asset-form";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T, useTranslator } from "@/i18n";
import { UNRESTRICTED_POLICY_ID } from "@/jsonld/policy";
import {
  defaultCreateContractDefinitionFormData,
  fromContractDefinitionForm,
  MdsContractDefinitionInput,
} from "@/utilities/contract-definition";
import { idSelector } from "@/utilities/data-offer";
import { fromPolicyDefinitionForm } from "@/utilities/policy";
import {
  isAndConstraint,
  isAtomicConstraint,
  isOrConstraint,
  isXoneConstraint,
  MultiplicityConstraint,
} from "@/utilities/policy-constraints";
import { Button, Divider } from "@mui/material";
import { AtomicConstraint } from "@think-it-labs/edc-connector-client";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/use-edc-connector";
import { FormEvent, useCallback, useState } from "react";

export default function CreateDataOfferPage() {
  const { push, connector } = useParticipantConnectorState();
  const { showSnackbar } = useAppSnackbar();
  const { translator } = useTranslator();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useAssetForm({ generateIdFromTitle: true, checkIdAvailability: true });
  const { asset, setAsset } = form;

  const [contract, setContract] = useState<MdsContractDefinitionInput>(
    defaultCreateContractDefinitionFormData,
  );
  const [policyExpression, setPolicyExpression] = useState<
    (AtomicConstraint | MultiplicityConstraint)[]
  >([]);
  const [publishMode, setPublishMode] = useState(
    PUBLISH_MODE_PUBLISH_UNRESTRICTED.value as string,
  );

  const client = useEdcConnectorClient({
    management: proxyConnectorManagement,
  });

  const policyExpressionIsNotValid = useCallback(
    (policyExpressionArg: (AtomicConstraint | MultiplicityConstraint)[]) => {
      if (publishMode !== PUBLISH_MODE_PUBLISH_RESTRICTED.value) {
        return false;
      }

      const checkInvalid = (
        policies: (AtomicConstraint | MultiplicityConstraint)[],
      ): boolean => {
        if (policies.length === 0) return true;

        return policies.some((policy): boolean => {
          if (isAtomicConstraint(policy)) {
            return !policy.rightOperand;
          }

          if (isOrConstraint(policy)) {
            return !policy.or.length || checkInvalid(policy.or);
          }

          if (isAndConstraint(policy)) {
            return !policy.and.length || checkInvalid(policy.and);
          }

          if (isXoneConstraint(policy)) {
            return !policy.xone.length || checkInvalid(policy.xone);
          }

          return false;
        });
      };

      return checkInvalid(policyExpressionArg);
    },
    [publishMode],
  );

  const cannotSubmit = () =>
    form.isInvalid() || policyExpressionIsNotValid(policyExpression);

  const createDataOffer = async () => {
    const createdAsset = await client.management.assets.create(
      fromAssetForm(asset, connector?.curatorName ?? ""),
    );
    if (publishMode === PUBLISH_MODE_DO_NOT_PUBLISH.value) {
      return;
    }

    let policyId = UNRESTRICTED_POLICY_ID;
    try {
      if (publishMode === PUBLISH_MODE_PUBLISH_RESTRICTED.value) {
        const policy = await client.management.policyDefinitions.create(
          fromPolicyDefinitionForm(policyExpression, ""),
        );
        policyId = policy["@id"];
      }

      await client.management.contractDefinitions.create(
        fromContractDefinitionForm({
          ...contract,
          assetsSelector: idSelector(createdAsset["@id"]),
          accessPolicyId: policyId,
          contractPolicyId: policyId,
        }),
      );
    } catch (error) {
      // Roll back what was created so the user can retry with the same asset id.
      if (policyId !== UNRESTRICTED_POLICY_ID) {
        await client.management.policyDefinitions
          .delete(policyId)
          .catch(() => undefined);
      }
      await client.management.assets
        .delete(createdAsset["@id"])
        .catch(() => undefined);
      throw error;
    }
  };

  const onSubmit = async (event?: FormEvent) => {
    event?.preventDefault();
    if (isSubmitting) {
      return;
    }
    if (cannotSubmit()) {
      form.validateAll();
      return;
    }

    setIsSubmitting(true);
    try {
      await createDataOffer();
    } catch {
      showSnackbar({
        type: "error",
        message: translator("dataOffer.new.dataOfferCreateError"),
        persist: false,
      });
      setIsSubmitting(false);
      return;
    }

    showSnackbar({
      type: "success",
      message:
        publishMode === PUBLISH_MODE_DO_NOT_PUBLISH.value
          ? translator("dataOffer.new.assetCreateSuccess")
          : translator("dataOffer.new.dataOfferCreateSuccess"),
      persist: false,
    });
    // Keep the form disabled until the redirect happens.
    setTimeout(
      () =>
        push(
          publishMode === PUBLISH_MODE_DO_NOT_PUBLISH.value
            ? "/assets"
            : "/data-offers",
        ),
      2000,
    );
  };

  if (!connector) {
    return <T string="common.noConnector" />;
  }

  return (
    <form data-testid="create-data-offer-form" onSubmit={onSubmit}>
      <div className="flex flex-col gap-y-12">
        <div className="flex flex-col gap-y-5">
          <FormSection titleKey="dataOffer.new.dataOfferTypeTitle" descriptionKey="dataOffer.new.dataOfferTypeDescription">
            <FormDataAddressStep
              translator={translator}
              formData={asset.dataAddress!}
              onChange={form.onDataAddressChange}
              errors={form.errors.dataAddress}
              customDataAddressConfigRows={6}
            />
          </FormSection>

          <Divider />

          <AssetFormSections form={form} />

          <Divider />

          <FormSection titleKey="dataOffer.new.dataOfferPublishingTitle" descriptionKey="dataOffer.new.dataOfferPublishingDescription">
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
                  onChange={setPolicyExpression}
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
                  value={contract.privateProperties.manualApproval}
                  onChange={(event) => {
                    setAsset({
                      ...asset,
                      properties: {
                        ...asset.properties,
                        additionalProperties: {
                          manual_approval: event.target.checked.toString(),
                        },
                      },
                    });
                    setContract({
                      ...contract,
                      privateProperties: {
                        manualApproval: event.target.checked,
                      },
                    });
                  }}
                />
              </>
            )}
          </FormSection>
        </div>

        <Divider />

        <div className="flex justify-end px-6 py-4">
          <Button
            data-testid="data-offer-create-submit"
            variant="contained"
            onClick={() => onSubmit()}
            disabled={isSubmitting || cannotSubmit()}
          >
            <T string="dataOffer.new.publish" />
          </Button>
        </div>
      </div>
    </form>
  );
}

CreateDataOfferPage.titleKey = "dataOffer.new.title";
