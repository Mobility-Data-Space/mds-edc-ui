import * as React from 'react';
import {PropsWithChildren} from "react";
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import {Plus} from "lucide-react";
import {T} from "@/i18n";
import { IconButton, Tooltip, TooltipProps} from "@mui/material";
import Divider from "@mui/material/Divider";

function PopoverMenu() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [subAnchorEl, setSubAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubAnchorEl(null);
  };

  const onMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("onMouseEnter : ", event)
    setSubAnchorEl(event.target as HTMLButtonElement);
  };

  const onMouseLeave = () => {
    console.log("onMouseLeave : ")
    setSubAnchorEl(null);
  };

  const popoverOpen = Boolean(anchorEl);
  const subPopoverOpen = popoverOpen && Boolean(subAnchorEl);
  const id = popoverOpen ? 'main-popover' : undefined;
  const subId = popoverOpen ? 'sub-popover' : undefined;

  const tooltipProps: Partial<TooltipProps> = {
    placement: "bottom-end",
    slotProps: {
      popper: {
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, -14],
            },
          },
        ],
      },
    }
  }

  return (
    <div>
      <Typography>
        <T string="dataOffer.new.policyExpression" />
      </Typography>
      <IconButton
        size="large"
        aria-describedby={id}
        onClick={handleClick}
        className="gap-x-2 font-medium"
        color="secondary"
      >
        <Plus className="h-6 w-6" />
      </IconButton>
      <Popover
        id={id}
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <div className="flex flex-col">
          <Tooltip {...tooltipProps} title="dataOffer.new.policyExpressionConsumerParticipantIdTooltip" >
            <Button variant="text" color="secondary" onMouseOver={onMouseLeave} >
              <Typography align="left" variant="body2" className="w-full p-2">
                <T string="dataOffer.new.policyExpressionConsumerParticipantId" />
              </Typography>
            </Button>
          </Tooltip>
          <Tooltip {...tooltipProps} title="dataOffer.new.policyExpressionTimeRestrictionTooltip">
            <Button variant="text" color="secondary" onMouseOver={onMouseLeave} >
              <Typography align="left" variant="body2" className="w-full p-2">
                <T string="dataOffer.new.policyExpressionTimeRestriction" />
              </Typography>
            </Button>
          </Tooltip>
          <Divider />
          <Tooltip {...tooltipProps} title="dataOffer.new.policyExpressionTimeSpanRestrictionTooltip">
            <Button variant="text" color="secondary" onMouseOver={onMouseLeave} >
              <Typography align="left" variant="body2" className="w-full p-2">
                <T string="dataOffer.new.policyExpressionTimeSpanRestriction" />
              </Typography>
            </Button>
          </Tooltip>
          <Divider />
          <Button variant="text" color="secondary" onMouseOver={onMouseEnter} >
            <Typography align="left" variant="body2" className="w-full p-2 flex flex-row justify-between items-center">
              <T string="dataOffer.new.policyExpressionCombine"/>
              <svg viewBox="0 0 5 10" focusable="false" className="size-3">
                <polygon points="0,0 5,5 0,10"></polygon>
              </svg>
            </Typography>
          </Button>
        </div>
        <Popover
          id={subId}
          open={subPopoverOpen}
          anchorEl={subAnchorEl}
          onClose={onMouseLeave}
          className="z-10"
          anchorOrigin={{
            vertical: 'center',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'center',
            horizontal: 'left',
          }}
        >
          <div className="flex flex-col">
            <Tooltip {...tooltipProps} title="dataOffer.new.policyExpressionAndTooltip">
              <Button variant="text" color="secondary">
                <Typography align="left" variant="body2" className="w-full p-2">
                  <T string="dataOffer.new.policyExpressionAnd"/>
                </Typography>
              </Button>
            </Tooltip>
            <Tooltip {...tooltipProps} title="dataOffer.new.policyExpressionOrTooltip">
              <Button variant="text" color="secondary">
                <Typography align="left" variant="body2" className="w-full p-2">
                  <T string="dataOffer.new.policyExpressionOr"/>
                </Typography>
              </Button>
            </Tooltip>
            <Tooltip {...tooltipProps} title="dataOffer.new.policyExpressionXoneTooltip">
              <Button variant="text" color="secondary">
                <Typography align="left" variant="body2" className="w-full p-2">
                  <T string="dataOffer.new.policyExpressionXone"/>
                </Typography>
              </Button>
            </Tooltip>
          </div>
        </Popover>
      </Popover>
    </div>
);
}

function CustomTreeHeader({ disableLine = false, children }: PropsWithChildren<{ disableLine?: boolean }> & { disableLine?: boolean }) {

  return (<>
    <div className={disableLine ? "" : "ml-8 border-l-2 border-black"}>
      {children}
    </div>
  </>);
}

function CustomTreeItem({ disableLine, children }: PropsWithChildren<{ disableLine?: boolean }>) {
  return <div className="p-2 pl-0">
    {disableLine ? "" :
      <span className={`mb-0.5 mr-2.5 h-5 w-3 inline-block border-b-2 border-black`}></span>
    }
    {children}
  </div>;
}

export default function PolicyExpression() {
  const [value, setValue] = React.useState([]);

  return (
    <div >
      {/* TODO: map value */}
      <CustomTreeHeader disableLine>
        <CustomTreeItem disableLine>
          <PopoverMenu />
        </CustomTreeItem>
      </CustomTreeHeader>
    </div>
  );
}

// TODO: remove
function Example() {
  const [value, setValue] = React.useState([]);

  return (
    <div>
      <CustomTreeHeader disableLine>
        <CustomTreeItem disableLine>
          @mui/x-data-grid
        </CustomTreeItem>
      </CustomTreeHeader>
      <CustomTreeHeader>
        <CustomTreeItem>
          @mui/x-date-pickers
        </CustomTreeItem>
        <CustomTreeItem>
          @mui/x-date-pickers-pro
        </CustomTreeItem>
      </CustomTreeHeader>
      <CustomTreeHeader>
        <CustomTreeItem>
          @mui/x-charts
        </CustomTreeItem>
      </CustomTreeHeader>
      <CustomTreeHeader>
        <CustomTreeHeader>
          <CustomTreeItem>
            @mui/x-data-grid
          </CustomTreeItem>
          <CustomTreeItem>
            @mui/x-data-grid-pro
          </CustomTreeItem>
          <CustomTreeItem>
            @mui/x-data-grid-premium
          </CustomTreeItem>
        </CustomTreeHeader>
        <CustomTreeHeader>
          <CustomTreeItem>
            @mui/x-date-pickers
          </CustomTreeItem>
          <CustomTreeItem>
            @mui/x-date-pickers-pro
          </CustomTreeItem>
        </CustomTreeHeader>
        <CustomTreeHeader>
          <CustomTreeItem>
            @mui/x-charts
          </CustomTreeItem>
        </CustomTreeHeader>
      </CustomTreeHeader>
    </div>
  );
}
