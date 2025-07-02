import ErrorIcon from "@mui/icons-material/Error";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Collapse, IconButton, SnackbarContent } from "@mui/material";
import React, { forwardRef, useState } from "react";

export interface ErrorSnackbarProps {
    message: string;
    details?: string;
    onClose?: () => void;
    action?: React.ReactNode;
}

export const ErrorSnackbar = forwardRef<HTMLDivElement, ErrorSnackbarProps>(
    ({ message, details, onClose, action }, ref) => {
        const [expanded, setExpanded] = useState(false);
        return (
            <SnackbarContent
                ref={ref}
                sx={{
                    backgroundColor: "#e53935",
                    color: "#fff",
                    borderRadius: 2,
                    boxShadow: 3,
                    fontFamily: 'Sans',
                    minWidth: 350,
                    maxWidth: 500,
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: 2,
                    minHeight: 56,
                    maxHeight: 300,
                }}
                message={
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                            <ErrorIcon sx={{ fontSize: 28, marginRight: 1, color: '#fff' }} />
                            <div style={{ fontWeight: 600, fontSize: 16, flex: 1 }}>{message}</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                {details && (
                                    <IconButton
                                        size="small"
                                        aria-label={expanded ? 'Hide details' : 'Show details'}
                                        color="inherit"
                                        onClick={() => setExpanded(e => !e)}
                                        sx={{ marginLeft: 1 }}
                                    >
                                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton>
                                )}
                                <IconButton size="small" aria-label="close" color="inherit" onClick={onClose}>
                                    <span className="sr-only">Close</span>
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 5L5 15M5 5L15 15" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </IconButton>
                            </div>
                        </div>
                        {details && (
                            <Collapse in={expanded}>
                                <div style={{
                                    fontSize: 13,
                                    opacity: 0.85,
                                    marginTop: 6,
                                    background: 'rgba(0,0,0,0.08)',
                                    borderRadius: 4,
                                    padding: '6px 10px',
                                    color: '#fff',
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
            />
        );
    }
);

ErrorSnackbar.displayName = "ErrorSnackbar";