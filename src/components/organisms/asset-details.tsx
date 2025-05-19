import React, {useEffect, useMemo, useState} from "react";
import {T, useTranslator} from "@/i18n";
import {Asset, compact, ContractDefinition} from "@think-it-labs/edc-connector-client";
import {readValue} from "@think-it-labs/edc-connector-ui/json-ld.tsx";
import {ASSET_KEYWORDS, ASSET_DESCRIPTION, ASSET_TITLE, ASSET_ID} from "@/schema/asset.ts";
import {Button, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Icon, Tooltip} from "@mui/material";
import {MarkdownCollapsableText} from "@/components/molecules/markdown-collapsable-text.tsx";
import Divider from "@mui/material/Divider";
import AssetFieldGrid from "@/components/molecules/asset-field-grid.tsx";
import {assetCustomFieldsToShow, assetFieldsToShow, assetPrivateFieldsToShow} from "@/utilities/asset.ts";
import {AssetFieldShow} from "@/components/molecules/asset-field-show.tsx";
import Typography from "@mui/material/Typography";
import {convertOdrlToJsonHtml, removeJsonLdSchemaFromProperties} from "@/schema/catalog.ts";
import {ConstraintShow} from "@/components/molecules/constraint-show.tsx";
import dynamic from "next/dynamic";
import {ReactJsonViewProps} from "react-json-view";
import FormControlLabel from "@mui/material/FormControlLabel";
import {ConfirmDialog} from "@/components/molecules/confirm-dialog.tsx";
import {useEdcClient, useParticipantConnectorState} from "@/hooks/use-participant-connector-state.ts";
import {POLICY_ASSIGNER, POLICY_TARGET} from "@/schema/policy.ts";
import {enqueueSnackbar} from "notistack";

interface AssetDetailsProps {
  asset: Asset;
  participantId: string;
  connectorEndpoint: string;
  contractDefinitions?: ContractDefinition[];
  assetIsOwned: boolean;
}

export default function AssetDetails({ asset, participantId, connectorEndpoint, contractDefinitions, assetIsOwned = true }: AssetDetailsProps) {
  const { translator } = useTranslator();

  const keywords = asset.properties[ASSET_KEYWORDS] || [];
  const description = readValue(asset.properties, ASSET_DESCRIPTION);
  const title = readValue(asset.properties, ASSET_TITLE) || "";
  const [shownFields, privateFields, customFields] = useMemo(() => [
    assetFieldsToShow(asset, participantId, connectorEndpoint),
    assetPrivateFieldsToShow(asset),
    assetCustomFieldsToShow(asset),
  ], [asset]);

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
      setCompactContractDefinitions(! contractDefinitions ?
        [] :
        await compact(contractDefinitions)
      );
    }

    compactConstraints();
  }, []);

  const [negotiateContractIsOpen, setNegotiateContractIsOpen] = useState(false);

  const edcClient = useEdcClient()

  const onNegotiateConfirm = (contractDefinition: any) => {
    edcClient.management.contractNegotiations.initiate({
      counterPartyAddress: connectorEndpoint,
      policy: {
        ...contractDefinition,
        [POLICY_ASSIGNER]: { "@id": participantId },
        [POLICY_TARGET]: { "@id": asset[ASSET_ID] },
      },
    }).then(() => {
      setNegotiateContractIsOpen(false);
    }).catch(error => {
      enqueueSnackbar(translator("common.errorOccurred"));
    })
  }

  return (
    <div className="flex flex-col gap-y-2.5">
      <div>
        {description ?
          <MarkdownCollapsableText data={description}/> :
          <T string="assets.new.noDescription" />
        }
      </div>

      <Divider />

      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword: { "@value": string }, index: number) =>
          <Chip className="font-medium text-sm !cursor-default" clickable label={keyword["@value"]} key={index} />
        )}
      </div>

      <div className="flex flex-col gap-y-9">
        <AssetFieldGrid fields={shownFields}/>
        <AssetFieldGrid fields={customFields} label="assets.new.customProperties"/>
        <AssetFieldGrid fields={privateFields} label="assets.new.privateProperties"/>

        <div className="flex flex-col gap-y-4">
          {contractDefinitions && contractDefinitions.map((contractDefinition, index) => (
            <div className="flex flex-col gap-y-4" key={index}>
              <Typography className="uppercase">
                <T string="contractDefinitions.contractOffer"/>
                {contractDefinitions.length < 2 ? "" : (" " + (index + 1))}
              </Typography>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 [overflow-wrap:anywhere]">
                <AssetFieldShow icon="category" label="contractDefinitions.id" value={contractDefinition["@id"]}/>
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
                          {contractDefinitions.length < 2 ? "" : (" " + (index + 1))}
                        </span>
                        <T string="contractDefinitions.contractPolicyJsonLd"/>
                      </div>
                      <Typography variant="body1" color="textSecondary">
                        {title}
                        {participantId}
                      </Typography>
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
                onConfirm={() => onNegotiateConfirm(contractDefinition)}
                title="contractNegotiations.negotiateConfirmTitle"
                content="contractNegotiations.negotiateConfirmContent"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
