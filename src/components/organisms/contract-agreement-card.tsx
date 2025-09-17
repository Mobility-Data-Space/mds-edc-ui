import { proxyConnectorManagement } from "@/constants/proxy";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T } from "@/i18n";
import { formatDateTimeAgo } from "@/utilities/date.ts";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import FileDownloadOffIcon from "@mui/icons-material/FileDownloadOff";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import FileUploadOffIcon from "@mui/icons-material/FileUploadOff";
import { Card, CardContent, LinearProgress, Skeleton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { ContractAgreement } from "@think-it-labs/edc-connector-client";
import { ContractAgreementView } from "@think-it-labs/edc-connector-ui/contract-agreement-view";

export interface ContractAgreementCard {
  contractAgreement: ContractAgreement;
  onClick: () => void;
}

const contractIcons = {
  terminated: {
    consumer: FileDownloadOffIcon,
    provider: FileUploadOffIcon,
  },
  active: {
    consumer: FileDownloadIcon,
    provider: FileUploadIcon,
  },
} as const;

export default function ContractAgreementCard({
  contractAgreement,
  onClick,
}: ContractAgreementCard) {
  const { connector } = useParticipantConnectorState();
  const isTerminated = contractAgreement.mandatoryValue<boolean>(
    "edc",
    "isTerminated",
  );
  const isRunning = contractAgreement.mandatoryValue<boolean>(
    "edc",
    "isRunning",
  );
  const transferCount = contractAgreement.mandatoryValue<number>(
    "edc",
    "transferCount",
  );

  const isConsumer = contractAgreement.consumerId === connector.id;
  const Icon =
    contractIcons[isTerminated ? "terminated" : "active"][
      isConsumer ? "consumer" : "provider"
    ];

  return (
    <ContractAgreementView
      id={contractAgreement.id}
      managementUrl={proxyConnectorManagement}
    >
      <ContractAgreementView.Loading
        fallback={
          <Card className="contract-agreement-card w-full max-w-[300px]">
            <CardContent className="flex flex-col gap-y-3">
              <div>
                <div className="flex gap-x-4">
                  <div className="flex items-center">
                    <Skeleton variant="circular" width={40} height={40} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Skeleton variant="text" width="80%" height={32} />
                    <Skeleton variant="text" width="60%" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-4 py-4">
                  <div className="col-span-2">
                    <Skeleton variant="text" width="40%" />
                    <Skeleton variant="text" width="70%" />
                  </div>
                  <div>
                    <Skeleton variant="text" width="50%" />
                    <Skeleton variant="text" width="60%" />
                  </div>

                  <div className="text-right">
                    <Skeleton
                      variant="text"
                      width="50%"
                      style={{ marginLeft: "auto" }}
                    />
                    <Skeleton
                      variant="text"
                      width="30%"
                      style={{ marginLeft: "auto" }}
                    />
                  </div>

                  <div>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="80%" />
                  </div>

                  <div className="text-right">
                    <Skeleton
                      variant="text"
                      width="50%"
                      style={{ marginLeft: "auto" }}
                    />
                    <Skeleton
                      variant="text"
                      width="40%"
                      style={{ marginLeft: "auto" }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        }
      >
        <Card
          className="contract-agreement-card w-full max-w-[300px]"
          onClick={onClick}
        >
          <CardContent className="flex flex-col gap-y-3">
            <div>
              <div className="flex gap-x-4">
                <div className="flex items-center">
                  <Icon
                    fontSize="large"
                    color={isTerminated ? "error" : "inherit"}
                  />
                </div>
                <div>
                  <Typography
                    data-testid="asset-id"
                    variant="h4"
                    className="!leading-none hover:underline cursor-pointer [word-break:break-word]"
                  >
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
                    <T string="contractAgreements.headingId" />
                  </Typography>
                  <Typography variant="body2">
                    <ContractAgreementView.Id />
                  </Typography>
                </div>
                <div>
                  <Typography variant="body2" color="textDisabled">
                    <T string="contractAgreements.signed" />
                  </Typography>
                  <Typography variant="body2">
                    {formatDateTimeAgo(
                      contractAgreement.contractSigningDate * 1000,
                    )}
                  </Typography>
                </div>

                <div className="text-right">
                  <Typography variant="body2" color="textDisabled">
                    <T string="contractAgreements.transfers" />
                  </Typography>
                  <Typography variant="body2">{transferCount}</Typography>
                </div>

                <div className="">
                  <Typography variant="body2" color="textDisabled">
                    <T string="contractAgreements.headingConsumer" /> →{" "}
                    <T string="contractAgreements.headingProvider" />
                  </Typography>
                  <Typography variant="body2">
                    <ContractAgreementView.ConsumerId /> →{" "}
                    <ContractAgreementView.ProviderId />
                  </Typography>
                </div>

                <div className="text-right">
                  <Typography variant="body2" color="textDisabled">
                    <T string="contractAgreements.status" />
                  </Typography>
                  <Typography
                    variant="body2"
                    color={isTerminated ? "error" : "inherit"}
                  >
                    <T
                      string={`contractAgreements.[id].status${isTerminated ? "Terminated" : "Active"}`}
                    />
                  </Typography>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </ContractAgreementView.Loading>
    </ContractAgreementView>
  );
}
