import { Icon, IconProps } from "@mui/material";

import { TransferProcess } from "@think-it-labs/edc-connector-client/dist/src/entities";

export function TransferProcessIcon({
  transferProcess,
  ...rest
}: { transferProcess: TransferProcess } & IconProps): React.ReactElement {
  let icon;

  if (transferProcess.type === "PROVIDER") {
    icon = "upload";
  } else if (transferProcess.type === "CONSUMER") {
    icon = "download";
  } else {
    icon = "";
  }

  return <Icon {...rest}>{icon}</Icon>;
}
