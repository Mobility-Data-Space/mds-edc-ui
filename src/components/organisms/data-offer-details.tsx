import React, {useEffect, useState} from "react";
import {Button, Icon, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import {enqueueSnackbar} from "notistack";
import {compact, Policy, PolicyBuilder} from "@think-it-labs/edc-connector-client";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";
import {TitleWithIcon} from "@/components/atoms/TitleWithIcon.tsx";

import {FieldShow} from "@/components/molecules/field-show.tsx";
import {ConfirmDialog} from "@/components/molecules/confirm-dialog";
import {useParticipantConnectorState} from "@/hooks/use-participant-connector-state";
import {T, useTranslator} from "@/i18n";
import { createNegotiationRequest } from "@/utilities/contract-negotiations";
import {removeJsonLdSchemaFromProperties} from "@/utilities/catalog";
import {PolicyConstraintShow} from "@/components/molecules/policy-constraint-show.tsx";

interface DataOfferDetailsProps {
  offers?: Policy[];
  assetId: string;
  participantId: string;
  counterPartyAddress: string ;
  assetIsOwned: boolean;
}

export default function DataOfferDetails({ offers, assetId, counterPartyAddress, participantId, assetIsOwned = false }: DataOfferDetailsProps) {
  const { connector } = useParticipantConnectorState() ;
  const { translator } = useTranslator();


  const [compactContractDefinitions, setCompactContractDefinitions] = useState([]);
  useEffect(() => {
    async function compactConstraints() {
      setCompactContractDefinitions(! offers ?
        [] :
        await compact(offers)
      );
    }

    compactConstraints();
  }, []);

  const [negotiateContractIsOpen, setNegotiateContractIsOpen] = useState<Record<string, boolean>>({});

  const edcClient = useEdcConnectorClient({management: connector.managementUrl});

  const onNegotiateConfirm = (offer: Policy) => {
    console.log("Negotiate: ", offer)
    const negotiation = createNegotiationRequest(offer, counterPartyAddress, participantId, assetId) ;
    edcClient.management.contractNegotiations.initiate(negotiation)
      .then(() => setNegotiateContractIsOpen(prev => ({ ...prev, [offer["@id"]]: false })))
      .catch(error => enqueueSnackbar(translator("common.errorOccurred")))
  }

  return (
    <div className="flex flex-col gap-y-2.5">
      <div className="flex flex-col gap-y-4">
        {offers && offers.map((offer, index) => (
          <div className="flex flex-col gap-y-4" key={index}>
            <Typography className="uppercase">
              <T string="contractDefinitions.contractOffer"/>
              {offers.length < 2 ? "" : (" " + (index + 1))}
            </Typography>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 [overflow-wrap:anywhere]">
              <FieldShow icon="category" label="contractDefinitions.id" value={offer["@id"]}/>
            </div>

            <PolicyConstraintShow
              constraints={removeJsonLdSchemaFromProperties(compactContractDefinitions)?.permission}
              jsonLdObject={compactContractDefinitions}
              jsonLdDialogTitle={<TitleWithIcon
                icon={<Icon className="mt-1.5" fontSize="large" >policy</Icon>}
                title={<div className="flex gap-x-1">
                  <T string="contractDefinitions.contractOffer"/>
                  <span>
                        {offers.length < 2 ? "" : (" " + (index + 1))}
                      </span>
                  <T string="contractDefinitions.contractPolicyJsonLd"/>
                </div>}
              />}
            />

            <div className="flex justify-end">
              <Tooltip
                title={<T string="contractNegotiations.cannotNegotiateOwnedConnectors"/>}
                disableHoverListener={!assetIsOwned}
                disableFocusListener={!assetIsOwned}
              >
                <span className="float-right">
                  <Button disabled={assetIsOwned} color="secondary" variant="contained" onClick={() => setNegotiateContractIsOpen(prev => ({ ...prev, [offer["@id"]]: true }))}>
                    <T string="common.negotiate"/>
                  </Button>
                </span>
              </Tooltip>
            </div>

    <ConfirmDialog
      open={negotiateContractIsOpen[offer["@id"]] || false}
      onClose={() => setNegotiateContractIsOpen(prev => ({ ...prev, [offer["@id"]]: false }))}
      onConfirm={() => onNegotiateConfirm(offer)}
      title="contractNegotiations.negotiateConfirmTitle"
      content="contractNegotiations.negotiateConfirmContent"
    />
          </div>
        ))}
      </div>
    </div>
  );
}
