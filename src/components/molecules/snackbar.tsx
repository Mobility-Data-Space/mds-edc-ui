import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Collapse, Icon, IconButton, SnackbarContent } from "@mui/material";
import { SnackbarContentProps } from "notistack";
import React, { forwardRef, useState } from "react";

export type SnackbarType = 'success' | 'info' | 'error';

export interface SnackbarProps extends SnackbarContentProps {
    type: SnackbarType;
    message: string;
    details?: string;
    onClose?: () => void;
    action?: React.ReactNode;
    showDetails?: boolean;
}

const getSnackbarStyles = (type: SnackbarType) => {
    const baseStyles = {
        fontFamily: 'Sans',
        minWidth: 350,
        maxWidth: 1500,
        display: 'flex',
        alignItems: 'flex-start',
        maxHeight: 300,
    };

    switch (type) {
        case 'success':
            return {
                ...baseStyles,
                backgroundColor: "#96D200",
                color: "#000"
            };
        case 'info':
            return {
                ...baseStyles,
                backgroundColor: "#ff9800",
                color: "#fff",
            };
        case 'error':
            return {
                ...baseStyles,
                backgroundColor: "#B91C1C",
                color: "#000",
            };
        default:
            return baseStyles;
    }
};

const getIcon = (type: SnackbarType) => {
    switch (type) {
        case 'success':
            return <CheckCircleOutlineOutlinedIcon sx={{ fontSize: 28, marginRight: 1 }} />;
        case 'info':
            return <InfoOutlinedIcon sx={{ fontSize: 28, marginRight: 1 }} />;
        case 'error':
            return <ErrorOutlineOutlinedIcon sx={{ fontSize: 28, marginRight: 1 }} />;
        default:
            return null;
    }
};

const getTestDataId = (t: SnackbarType) => {
    switch (t) {
        case "success":
            return "toast-success-message"
        case "error":
            return "toast-error-message"
        case "info":
            return "toast-info-message"
    }
}

export const Snackbar = forwardRef<HTMLDivElement, SnackbarProps>(
    ({ type, message, details, onClose, action, showDetails = true, ...props }, ref) => {
        const [expanded, setExpanded] = useState(false);

        return (
            <SnackbarContent
                ref={ref}
                data-testid={getTestDataId(type)}
                sx={getSnackbarStyles(type)}
                message={
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                            {getIcon(type)}
                            <div style={{ fontWeight: 600, fontSize: 16, flex: 1 }}>{message}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {details && showDetails && (
                                    <IconButton
                                        size="small"
                                        aria-label={expanded ? 'Hide details' : 'Show details'}
                                        color="inherit"
                                        onClick={() => setExpanded(e => !e)}
                                        sx={{ marginLeft: 1 }}
                                    >
                                        <Icon>{`expand_${expanded ? "less" : "more"}`}</Icon>
                                    </IconButton>
                                )}
                                <IconButton size="small" aria-label="close" color="inherit" onClick={onClose}>
                                    <span className="sr-only">Close</span>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 5L5 15M5 5L15 15" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </IconButton>
                            </div>
                        </div>
                        {details && showDetails && (
                            <Collapse in={expanded}>
                                <div style={{
                                    fontSize: 13,
                                    opacity: 0.85,
                                    marginTop: 6,
                                    background: 'rgba(0,0,0,0.08)',
                                    borderRadius: 4,
                                    padding: '6px 10px',
                                    maxHeight: 120,
                                    overflowY: 'auto',
                                    wordBreak: 'break-all',
                                    width: '100%'
                                }}>
                                    {details}
                                </div>
                            </Collapse>
                        )}
                    </div>
                }
                action={action}
                {...props}
            />
        );
    }
);

Snackbar.displayName = "Snackbar";
