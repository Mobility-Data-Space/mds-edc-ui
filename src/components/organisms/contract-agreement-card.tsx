import React from "react";
import Typography from "@mui/material/Typography";
import {Card, CardContent, Icon} from "@mui/material";
import {ContractAgreement} from "@think-it-labs/edc-connector-client";
import {ContractAgreementView} from "@think-it-labs/edc-connector-ui/contract-agreement-view.tsx";
import {ContractAgreementsList} from "@think-it-labs/edc-connector-ui/contract-agreements-list.tsx";
import {T} from "@/i18n";
import {Timestamp} from "@think-it-labs/edc-connector-ui/timestamp.tsx";
import {useParticipantConnectorState} from "@/hooks/use-participant-connector-state.ts";

export interface AssetCardProps {
  contractAgreement: ContractAgreement;
  onClick: () => void;
}

export default function ContractAgreementCard({ contractAgreement, onClick }: AssetCardProps) {
  const { connector } = useParticipantConnectorState();
  console.log("ContractAgreementCard : ", contractAgreement);
  return (
    <ContractAgreementView id={contractAgreement.id} managementUrl={connector.managementUrl}>
      <Card className="w-[300px]" onClick={onClick}>
        <CardContent className="flex flex-col gap-y-3">
          <div>
            <div className="flex gap-x-4">
              <div className="flex items-center">
                <Icon fontSize="large">{contractAgreement["https://w3id.org/edc/v0.0.1/ns/providerId"] === connector.id ? "file_upload" : "file_download"}</Icon>
              </div>
              <div>
                <ContractAgreementsList.Asset
                  id={contractAgreement.assetId}
                  managementUrl={connector!.managementUrl}
                >
                  <Typography variant="h4" className="!leading-none hover:underline cursor-pointer">
                    <ContractAgreementsList.Asset.Id />
                  </Typography>
                </ContractAgreementsList.Asset>
                <Typography variant="body1" color="textSecondary">
                  <ContractAgreementView.ProviderId />
                </Typography>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 py-4">
              <div className="even:text-right">
                <Typography variant="body2" color="textDisabled">
                  <T string="contractAgreements.headingId"/>
                </Typography>
                <Typography variant="body2">
                  <ContractAgreementView.Id/>
                </Typography>
              </div>
              <div className="even:text-right">
                <Typography variant="body2" color="textDisabled">
                  <T string="contractAgreements.signed"/>
                </Typography>
                <Typography variant="body2">
                  <Timestamp milliseconds={contractAgreement.contractSigningDate}/>
                </Typography>
              </div>

{/*
              <div className="even:text-right">
                <Typography variant="body2" color="textDisabled">
                  <T string="contractAgreements.transfers"/>
                </Typography>
                <Typography variant="body2">
                  {/*TODO: transfers*/}{/*
                </Typography>
              </div>

              <div className="even:text-right">
                <Typography variant="body2" color="textDisabled">
                  <T string="contractAgreements.otherConnector"/>
                </Typography>
                <Typography variant="body2">
                  {/*TODO: otherConnector*/}{/*
                </Typography>
              </div>
              <div className="even:text-right">
                <Typography variant="body2" color="textDisabled">
                  <T string="contractAgreements.status"/>
                </Typography>
                <Typography variant="body2">
                  {/*TODO: status*/}{/*
                </Typography>
              </div>
*/}

              <div className="col-span-2">
                <Typography variant="body2" color="textDisabled">
                  <T string="contractAgreements.headingConsumer" /> →{" "} <T string="contractAgreements.headingProvider" />
                </Typography>
                <Typography variant="body2">
                  <ContractAgreementView.ConsumerId/> →{" "} <ContractAgreementView.ProviderId/>
                </Typography>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </ContractAgreementView>
  );
}
