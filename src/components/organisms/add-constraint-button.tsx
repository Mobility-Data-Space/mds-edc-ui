import DateRangePicker from "@/components/molecules/date-range-picker";
import { T, useTranslator } from "@/i18n";
import { DATE_FORMAT } from "@/utilities/date";
import {AndConstraint, createParticipantIdConstraint, createTimeRestrictionConstraint, createTimespanAndConstraint, MultiplicityConstraint, OrConstraint, XoneConstraint} from "@/utilities/policy-constraints";
import {IconButton, Button as MuiButton, Tooltip, TooltipProps, Icon} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Modal from "@mui/material/Modal";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { AtomicConstraint } from "@think-it-labs/edc-connector-client";
import * as React from "react";

export interface AddConstraintButtonProps {
  showAddButton?: boolean;
  isFirstLevel?: boolean;
  onClick: (constraint: AtomicConstraint | MultiplicityConstraint) => void;
}

export function AddConstraintButton({ showAddButton = false, onClick }: AddConstraintButtonProps) {
  const { translator } = useTranslator();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [subAnchorEl, setSubAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [dateRangeModalIsOpen, setDateRangeModalIsOpen] = React.useState(false);
  const [dateRangeModalValue, setDateRangeModalValue] = React.useState<[string, string]>(["", ""]);

  const onAddWithClose = (constraint: AtomicConstraint | MultiplicityConstraint) => {
    onClick(constraint);
    handleClose();
    setDateRangeModalIsOpen(false);
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSubAnchorEl(null);
  };

  const onMouseEnter = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSubAnchorEl(event.currentTarget);
  };

  const onMouseLeave = () => {
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

  const addButton = (
    <IconButton
      data-testid="add-expression-button"
      size="large"
      aria-describedby={id}
      onClick={handleClick}
      className="gap-x-2 font-medium"
      color="secondary"
    >
      <Icon style={{ fontSize: "28px" }} >add</Icon>
    </IconButton>
  );

  return (
    <div>
      {!showAddButton ? "" : addButton}

      <Modal
        open={dateRangeModalIsOpen}
        onClose={() => setDateRangeModalIsOpen(false)}
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" component="h2" className="!mb-4">
            <T string="dataOffer.new.dataOfferTimespanRestriction" />
          </Typography>
          <DateRangePicker
            label={<T string="dataOffer.new.dataOfferDateRange" />}
            helperText={`${DATE_FORMAT} - ${DATE_FORMAT}`}
            value={dateRangeModalValue}
            onChange={(newValue) => setDateRangeModalValue(newValue)}
          />
          <div className="flex justify-end gap-x-2 px-6 py-4">
            <MuiButton
              color="secondary"
              onClick={() => setDateRangeModalIsOpen(false)}
            >
              <T string="common.cancel" />
            </MuiButton>
            <MuiButton
              data-testid="asset-create-submit"
              variant="contained"
              disabled={dateRangeModalValue[0] === "" || dateRangeModalValue[1] === ""}
              onClick={() => onAddWithClose(createTimespanAndConstraint(dateRangeModalValue))}
            >
              <T string="common.add" />
            </MuiButton>
          </div>
        </Box>
      </Modal>

      <Popover
        id={id}
        open={popoverOpen}
        anchorEl={anchorEl}
        onClose={handleClose}
        slotProps={{
          backdrop: {
            invisible: true,
          },
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <div className="flex flex-col z-10">
          <Tooltip {...tooltipProps} title={translator("dataOffer.new.policyExpressionConsumerParticipantIdTooltip")}>
            <Button data-testid="participant-id-expression" variant="text" color="secondary" onClick={() => onAddWithClose(createParticipantIdConstraint())}
              onMouseOver={onMouseLeave}>
              <Typography align="left" variant="body2" className="w-full p-2">
                <T string="dataOffer.new.policyExpressionConsumerParticipantId" />
              </Typography>
            </Button>
          </Tooltip>
          <Tooltip {...tooltipProps} title={translator("dataOffer.new.policyExpressionTimeRestrictionTooltip")}>
            <Button variant="text" color="secondary" onClick={() => onAddWithClose(createTimeRestrictionConstraint())}
              onMouseOver={onMouseLeave}>
              <Typography align="left" variant="body2" className="w-full p-2">
                <T string="dataOffer.new.policyExpressionTimeRestriction" />
              </Typography>
            </Button>
          </Tooltip>
          <Divider />
          <Tooltip {...tooltipProps} title={translator("dataOffer.new.policyExpressionTimeSpanRestrictionTooltip")}>
            <Button variant="text" color="secondary" onMouseOver={onMouseLeave} onClick={() => {
              setDateRangeModalIsOpen(true);
              handleClose();
            }}>
              <Typography align="left" variant="body2" className="w-full p-2">
                <T string="dataOffer.new.policyExpressionTimeSpanRestriction" />
              </Typography>
            </Button>
          </Tooltip>
          <Divider />
          <Button variant="text" color="secondary" onMouseOver={onMouseEnter}>
            <Typography align="left" variant="body2" className="w-full p-2 flex flex-row justify-between items-center">
              <T string="dataOffer.new.policyExpressionCombine" />
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
            <Tooltip {...tooltipProps} title={translator("dataOffer.new.policyExpressionAndTooltip")}>
              <Button variant="text" color="secondary" onClick={() => onAddWithClose({ and: [] } as AndConstraint)}>
                <Typography align="left" variant="body2" className="w-full p-2">
                  <T string="dataOffer.new.policyExpressionAnd" />
                </Typography>
              </Button>
            </Tooltip>
            <Tooltip {...tooltipProps} title={translator("dataOffer.new.policyExpressionOrTooltip")}>
              <Button variant="text" color="secondary" onClick={() => onAddWithClose({ or: [] } as OrConstraint)}>
                <Typography align="left" variant="body2" className="w-full p-2">
                  <T string="dataOffer.new.policyExpressionOr" />
                </Typography>
              </Button>
            </Tooltip>
            <Tooltip {...tooltipProps} title={translator("dataOffer.new.policyExpressionXoneTooltip")}>
              <Button variant="text" color="secondary" onClick={() => onAddWithClose({ xone: [] } as XoneConstraint)}>
                <Typography align="left" variant="body2" className="w-full p-2">
                  <T string="dataOffer.new.policyExpressionXone" />
                </Typography>
              </Button>
            </Tooltip>
          </div>
        </Popover>
      </Popover>
    </div>
  );
}
