import React from "react";
import Typography from "@mui/material/Typography";
import {Card, CardContent, Icon, LinearProgress} from "@mui/material";
import {ContractAgreement} from "@think-it-labs/edc-connector-client";
import {ContractAgreementView} from "@think-it-labs/edc-connector-ui/contract-agreement-view";
import {ContractAgreementsList} from "@think-it-labs/edc-connector-ui/contract-agreements-list";
import {Timestamp} from "@think-it-labs/edc-connector-ui/timestamp";

import {T} from "@/i18n";
import {useParticipantConnectorState} from "@/hooks/use-participant-connector-state";

export interface ContractAgreementCard {
  contractAgreement: ContractAgreement;
  isTerminated?: boolean;
  isRunning?: boolean;
  transferCount?: number;
  onClick: () => void;
}

export default function ContractAgreementCard({ contractAgreement, onClick, isTerminated = false, isRunning = false, transferCount = 0 }: ContractAgreementCard) {
  const { connector } = useParticipantConnectorState();

  return (
    <ContractAgreementView id={contractAgreement.id} managementUrl={connector.managementUrl}>
      <Card className="w-[300px]" onClick={onClick}>
        <CardContent className="flex flex-col gap-y-3">
          <div>
            <div className="flex gap-x-4">
              <div className="flex items-center">
                <Icon fontSize="large" color={isTerminated ? "error" : "inherit"}>
                  {
                    (contractAgreement.consumerId === connector.id ? "file_download" : "file_upload") +
                    (isTerminated ? "_off" : "")
                  }
                </Icon>
              </div>
              <div>
                <Typography variant="h4" className="!leading-none hover:underline cursor-pointer">
                  <ContractAgreementView.AssetId />
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  <ContractAgreementView.ProviderId />
                </Typography>
              </div>

              {isRunning && <LinearProgress className="my-3" />}
            </div>

            <div className="grid grid-cols-2 gap-y-4 py-4">
              <div className="col-span-2">
                <Typography variant="body2" color="textDisabled">
                  <T string="contractAgreements.headingId"/>
                </Typography>
                <Typography variant="body2">
                  <ContractAgreementView.Id/>
                </Typography>
              </div>
              <div>
                <Typography variant="body2" color="textDisabled">
                  <T string="contractAgreements.signed"/>
                </Typography>
                <Typography variant="body2">
                  <Timestamp milliseconds={contractAgreement.contractSigningDate} year="numeric" month="2-digit" day="2-digit" hour="numeric" minute="numeric" />
                </Typography>
              </div>

              <div className="text-right">
                <Typography variant="body2" color="textDisabled">
                  <T string="contractAgreements.transfers"/>
                </Typography>
                <Typography variant="body2">
                  {transferCount}
                </Typography>
              </div>

              <div className="">
                <Typography variant="body2" color="textDisabled">
                  <T string="contractAgreements.headingConsumer"/> →{" "} <T
                  string="contractAgreements.headingProvider"/>
                </Typography>
                <Typography variant="body2">
                  <ContractAgreementView.ConsumerId/> →{" "} <ContractAgreementView.ProviderId/>
                </Typography>
              </div>

              <div className="text-right">
                <Typography variant="body2" color="textDisabled">
                  <T string="contractAgreements.status"/>
                </Typography>
                <Typography variant="body2" color={isTerminated ? "error" : "inherit"}>
                  <T string={`contractAgreements.[id].status${isTerminated ? 'Terminated' : "Active"}`} />
                </Typography>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </ContractAgreementView>
  );
}
