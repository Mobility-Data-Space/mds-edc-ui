import { Button } from "@/components/atoms/button";
import { Table } from "@/components/atoms/table";
import { ConnectorDashboard } from "@/components/templates/connector-dashboard";
import { AssetsList } from "@think-it-labs/edc-connector-ui/assets-list";
import { useConnectorDashboardState } from "@/hooks/use-connector-dashboard-state";
import { usePagination } from "@/hooks/use-pagination";
import { T } from "@/i18n";
import { ChevronLeft, ChevronRight, Plus, Search } from "lucide-react";
import { Modal, Box } from '@mui/material';

import React, {useState} from "react";
import CreateAssetForm from "@/components/templates/create-asset-form.tsx";
import CreateDataOfferForm from "@/components/templates/create-data-offer-form.tsx";
import SideDrawer from "@/components/organisms/side-drawer.tsx";

export default function CreateAssetPage() {
  return (
    <SideDrawer title={<T string="dataOffer.new.title" />}>
      <CreateDataOfferForm />
    </SideDrawer>
  );
}
