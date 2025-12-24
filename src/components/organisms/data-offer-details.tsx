import { useEffect, useState } from "react";
import { Button, Icon, Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import { enqueueSnackbar } from "notistack";
import { compact, Policy } from "@think-it-labs/edc-connector-client";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/use-edc-connector";
import { TitleWithIcon } from "@/components/atoms/TitleWithIcon";
import { FieldShow } from "@/components/molecules/field-show";
import { ConfirmDialog } from "@/components/molecules/confirm-dialog";
import { T, useTranslator } from "@/i18n";
import { createNegotiationRequest } from "@/utilities/contract-negotiations";
import { removeJsonLdSchemaFromProperties } from "@/utilities/catalog";
import { PolicyConstraintShow } from "@/components/molecules/policy-constraint-show";
import { proxyConnectorManagement } from "@/constants/proxy";

interface DataOfferDetailsProps {
  offers?: Policy[];
  assetId: string;
  participantId: string;
  counterPartyAddress: string;
  assetIsOwned: boolean;
  onNegotiateSuccess?: () => void;
}

export default function DataOfferDetails({
  offers,
  assetId,
  counterPartyAddress,
  participantId,
  assetIsOwned = false,
  onNegotiateSuccess = () => { },
}: DataOfferDetailsProps) {
  const { translator } = useTranslator();

  const [compactContractDefinitions, setCompactContractDefinitions] = useState<
    Policy[]
  >([]);

  useEffect(() => {
    if (!offers) {
      return;
    }
    compact(offers).then((compacted) =>
      setCompactContractDefinitions(compacted as unknown as Policy[]),
    );
  }, [offers]);

  const [negotiateContractIsOpen, setNegotiateContractIsOpen] = useState<
    Record<string, boolean>
  >({});

  const edcClient = useEdcConnectorClient({
    management: proxyConnectorManagement,
  });

  const onNegotiateConfirm = (offer: Policy) => {
    const negotiation = createNegotiationRequest(
      offer,
      counterPartyAddress,
      participantId,
      assetId,
    );
    edcClient.management.contractNegotiations
      .initiate(negotiation)
      .then(() => {
        onNegotiateSuccess();
        setNegotiateContractIsOpen((prev) => ({
          ...prev,
          [offer["@id"]]: false,
        }));
        enqueueSnackbar(translator("contractNegotiations.negotiationSuccess"));
      })
      .catch((error) => {
        const match = /"message":"(.*?)"/.exec(error.message);
        enqueueSnackbar(
          (match && match[1]) || translator("dataOffer.negotiateError"),
        );
      });
  };

  return (
    <div className="flex flex-col gap-y-2.5">
      <div className="flex flex-col gap-y-4">
        {offers &&
          offers.map((offer, index) => (
            <div className="flex flex-col gap-y-4" key={index}>
              <Typography className="uppercase">
                <T string="contractDefinitions.contractOffer" />
                {offers.length < 2 ? "" : " " + (index + 1)}
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 [overflow-wrap:anywhere]">
                <FieldShow
                  icon="category"
                  label="contractDefinitions.id"
                  value={offer["@id"]}
                />
              </div>

              <PolicyConstraintShow
                constraints={
                  removeJsonLdSchemaFromProperties(compactContractDefinitions)
                    ?.permission
                }
                jsonLdObject={offer}
                jsonLdDialogTitle={
                  <TitleWithIcon
                    icon={
                      <Icon className="mt-1.5" fontSize="large">
                        policy
                      </Icon>
                    }
                    title={
                      <div className="flex gap-x-1">
                        <T string="contractDefinitions.contractOffer" />
                        <span>
                          {offers.length < 2 ? "" : " " + (index + 1)}
                        </span>
                        <T string="contractDefinitions.contractPolicyJsonLd" />
                      </div>
                    }
                  />
                }
              />

              <div className="flex justify-end">
                <Tooltip
                  title={
                    <T string="contractNegotiations.cannotNegotiateOwnedConnectors" />
                  }
                  disableHoverListener={!assetIsOwned}
                  disableFocusListener={!assetIsOwned}
                >
                  <span className="float-right">
                    <Button
                      disabled={assetIsOwned}
                      color="secondary"
                      variant="contained"
                      onClick={() =>
                        setNegotiateContractIsOpen((prev) => ({
                          ...prev,
                          [offer["@id"]]: true,
                        }))
                      }
                    >
                      <T string="common.negotiate" />
                    </Button>
                  </span>
                </Tooltip>
              </div>

              <ConfirmDialog
                open={negotiateContractIsOpen[offer["@id"]] || false}
                onClose={() =>
                  setNegotiateContractIsOpen((prev) => ({
                    ...prev,
                    [offer["@id"]]: false,
                  }))
                }
                onConfirm={() => onNegotiateConfirm(offer)}
                title="contractNegotiations.negotiateConfirmTitle"
                content="contractNegotiations.negotiateConfirmContent"
                confirmCheckboxText={translator(
                  "catalog.negotiationConfirmationCheckbox",
                )}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
