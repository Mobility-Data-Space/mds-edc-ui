import { proxyConnectorManagement } from "@/constants/proxy";
import { T } from "@/i18n";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { EdrView } from "@think-it-labs/edc-connector-ui/edr-view";
import { TitleWithIcon } from "../atoms/TitleWithIcon";
import { Edr } from "@think-it-labs/edc-connector-client";

interface EdrDialogProps {
  edr: Edr;
  open: boolean;
  onClose: () => void;
}

export default function EdrDialog({ open, onClose, edr }: EdrDialogProps) {
  return (
    <EdrView managementUrl={proxyConnectorManagement} id={edr.id}>
      <Dialog
        open={open}
        maxWidth="lg"
        id="negotiation-details"
        className="my-7"
        onClose={onClose}
      >
        <DialogTitle>
          <TitleWithIcon title={edr.assetId} />
        </DialogTitle>
        <DialogContent>
          <ul>
            <li className="mt-2">
              <span className="font-bold">
                <T string="edrs.[id].type" />
              </span>
              : <EdrView.Properties.Type />
            </li>
            <li className="mt-2">
              <span className="font-bold">
                <T string="edrs.[id].authType" />
              </span>
              : <EdrView.Properties.AuthType />
            </li>
            <li className="mt-2">
              <span className="font-bold">
                <T string="edrs.[id].endpointType" />
              </span>
              : <EdrView.Properties.EndpointType />
            </li>
            <li className="mt-2">
              <span className="font-bold">
                <T string="edrs.[id].endpoint" />
              </span>
              : <EdrView.Properties.Endpoint />
            </li>
            <li className="mt-2">
              <span className="font-bold">
                <T string="edrs.[id].authorization" />
              </span>
              : <EdrView.Properties.Authorization />
            </li>
          </ul>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            <T string="common.close" />
          </Button>
        </DialogActions>
      </Dialog>
    </EdrView>
  );
}
