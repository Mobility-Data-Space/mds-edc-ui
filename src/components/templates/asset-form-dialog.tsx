import React from "react";

import {Dialog, DialogContent} from "@mui/material";

import AssetForm from "@/components/organisms/asset-form";

interface AssetFormDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AssetFormDialog({ open, onClose }: AssetFormDialogProps) {
  return (
    <Dialog
      open={open}
      maxWidth="lg"
      className="create-asset-form my-7"
      onClose={() => onClose}
    >
      <DialogContent style={{ maxWidth: "80vw", width: "800px" }}>
        <AssetForm />
      </DialogContent>
    </Dialog>
  );
}
