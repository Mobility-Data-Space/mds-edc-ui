import React, {useEffect, useState} from "react";
import {Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Icon, Tooltip} from "@mui/material";
import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import {enqueueSnackbar} from "notistack";
import {ReactJsonViewProps} from "react-json-view";
import dynamic from "next/dynamic";
import {compact, Policy} from "@think-it-labs/edc-connector-client";
import { useEdcConnectorClient } from "@think-it-labs/edc-connector-ui/hooks/use-edc-connector-client";

import {AssetFieldShow} from "@/components/molecules/asset-field-show";
import {ConstraintShow} from "@/components/molecules/constraint-show";
import {ConfirmDialog} from "@/components/molecules/confirm-dialog";
import {useParticipantConnectorState} from "@/hooks/use-participant-connector-state";
import {T, useTranslator} from "@/i18n";
import { createNegotiationRequest } from "@/utilities/contract_negotiations";
import {convertOdrlToJsonHtml, removeJsonLdSchemaFromProperties} from "@/utilities/catalog";

interface DataOfferDetailsProps {
  offers?: Policy[];
  assetId: string;
  counterPartyAddress: string ;
  assetIsOwned: boolean;
}

export default function DataOfferDetails({ offers, assetId, counterPartyAddress, assetIsOwned = false }: DataOfferDetailsProps) {
  const { connector } = useParticipantConnectorState() ;
  const { translator } = useTranslator();

  const [jsonIsCleaned, setJsonIsCleaned] = useState(false);
  const [jsonLdModalOpen, setJsonLdModalOpen] = useState(false);
  const onOpen = () => setJsonLdModalOpen(true);
  const onClose = () => setJsonLdModalOpen(false);
  const [ReactJson, setReactJson] = useState<React.ComponentType<ReactJsonViewProps>>();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setReactJson(dynamic(import("react-json-view"), { ssr: false }));
    }
  }, [])

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

  const [negotiateContractIsOpen, setNegotiateContractIsOpen] = useState(false);

  const edcClient = useEdcConnectorClient({management: connector.managementUrl});

  const onNegotiateConfirm = (offer: Policy) => {
    console.log(offer)

    const negotiation = createNegotiationRequest(offer, counterPartyAddress, connector.id, assetId) ;
    edcClient.management.contractNegotiations.initiate(negotiation)
      .then(() => setNegotiateContractIsOpen(false))
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
              <AssetFieldShow icon="category" label="contractDefinitions.id" value={offer["@id"]}/>
            </div>

            <div className="sm:grid sm:grid-cols-3">
              <div className="flex flex-row gap-x-2 sm:col-span-2">
                <Icon className="mt-1.5">policy</Icon>
                <div>
                  <Typography variant="body2" color="textDisabled" className="uppercase">
                    <T string="contractDefinitions.contractPolicy"/>
                  </Typography>
                  <div>
                    <ConstraintShow
                      data={convertOdrlToJsonHtml(removeJsonLdSchemaFromProperties(compactContractDefinitions)?.permission?.constraint, ",")}/>
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-x-2 sm:col-span-1">
                <Icon className="mt-1.5">policy</Icon>
                <div className="flex flex-col gapy-y-2">
                  <Typography variant="body2" color="textDisabled" className="uppercase">
                    <T string="contractDefinitions.contractPolicyJsonLd"/>
                  </Typography>
                  <Typography className="!leading-none hover:underline cursor-pointer" onClick={onOpen}>
                    <T string="common.showJsonLd"/>
                  </Typography>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Tooltip title={<T string="contractNegotiations.cannotNegotiateOwnedConnectors"/>}
                        disableHoverListener={!assetIsOwned} disableFocusListener={!assetIsOwned}>
              <span className="float-right">
                <Button disabled={assetIsOwned} color="secondary" variant="contained" onClick={() => setNegotiateContractIsOpen(true)}>
                  <T string="common.negotiate"/>
                </Button>
              </span>
              </Tooltip>
            </div>

            <Dialog
              open={jsonLdModalOpen}
              maxWidth="lg"
              className="my-7 py-5"
              onClose={onClose}
            >
              <DialogTitle>
                <div className="flex flex-row gap-x-2 items-center">
                  <Icon className="mt-1.5" fontSize="large" >policy</Icon>
                  <div className="flex flex-col gapy-y-2">
                    <div className="flex gap-x-1">
                      <T string="contractDefinitions.contractOffer"/>
                      <span>
                        {offers.length < 2 ? "" : (" " + (index + 1))}
                      </span>
                      <T string="contractDefinitions.contractPolicyJsonLd"/>
                    </div>
                  </div>
                </div>
              </DialogTitle>
              <DialogContent style={{ maxWidth: "80vw", width: "800px" }}>
                {ReactJson && <ReactJson
                  src={jsonIsCleaned ? removeJsonLdSchemaFromProperties(compactContractDefinitions) : compactContractDefinitions}
                  displayObjectSize={false}
                  displayDataTypes={false}
                  enableClipboard={false}
                />}
              </DialogContent>
              <DialogActions>
                <div className="flex flex-1 px-5 justify-between">
                <FormControlLabel label={<T string="common.cleanedJson" />} control={<Checkbox color="secondary" value={jsonIsCleaned} onChange={() => setJsonIsCleaned((value) => !value)} />} />
                  <Button color="secondary" onClick={onClose}>
                    <T string="common.close" />
                  </Button>
                </div>
              </DialogActions>
            </Dialog>

            <ConfirmDialog
              open={negotiateContractIsOpen}
              onClose={() => setNegotiateContractIsOpen(false)}
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
