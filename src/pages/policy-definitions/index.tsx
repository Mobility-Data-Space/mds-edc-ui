import React, { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight, CirclePlus } from "lucide-react";
import { Button as MuiButton, IconButton, Icon } from "@mui/material";
import { PolicyDefinitionsList } from "@think-it-labs/edc-connector-ui/policy-definitions-list";
import PolicyCard from "@/components/organisms/policy-card";
import { useParticipantConnectorState } from "@/hooks/use-participant-connector-state";
import { T } from "@/i18n";
import SideDrawer from "@/components/organisms/side-drawer";
import { PolicyDefinition } from "@think-it-labs/edc-connector-client";
import { JsonLdDialog } from "@/components/molecules/JsonLdDialog";
import { TitleWithIcon } from "@/components/atoms/TitleWithIcon";
import { useRouter } from "next/router";
import { List } from "@think-it-labs/edc-connector-ui/list";

const MAX_ITEMS = 25

export default function PolicyDefinitionListPage() {
  const router = useRouter()
  const { push, connector } = useParticipantConnectorState();

  const managementUrl = connector?.managementUrl as string;

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [openPolicyDefinitionData, setOpenPolicyDefinitionData] = useState({
    policyDefinition: {} as PolicyDefinition,
  });

  const openDetailsModal = (policyDefinition: PolicyDefinition) => {
    setIsDetailsModalOpen(true);
    setOpenPolicyDefinitionData({ policyDefinition });
  };

  const navigate = useCallback((newPage: number) => {
    router.push(
      {
        href: window.location.href,
        query: {
          ...router.query,
          page: newPage,
        },
      },
    );
  }, [])

  return (
    <SideDrawer title={<T string="policyDefinitions.title" />}>
      <JsonLdDialog
        isOpen={isDetailsModalOpen}
        jsonLdObject={openPolicyDefinitionData.policyDefinition?.policy?.permissions}
        onClose={() => setIsDetailsModalOpen(false)}
        title={<TitleWithIcon
          title={openPolicyDefinitionData.policyDefinition?.id}
          subtitle={<T string="policyDefinitions.policy" />}
          icon={<Icon fontSize="large">policy</Icon>}
        />}
      />
      <PolicyDefinitionsList
        usePagination
        navigate={navigate}
        currentPage={parseInt(router.query.page as string) || 0}
        firstPage={0}
        managementUrl={managementUrl}
      >
        <div className="flex gap-x-5">
          <div className="flex items-center">
            <div>
              <MuiButton onClick={() => push("/policy-definitions/new")} variant="contained">
                <CirclePlus fontSize="large" className="mr-2" />
                <T string="policyDefinitions.createPolicy" />
              </MuiButton>
            </div>
          </div>
          <div className="flex justify-end items-center flex-grow">
            <List.Pagination>
              {({ decrementPage, hasNext, hasPrev, incrementPage }) =>
                <div className="inline-flex float-right gap-x-2">
                  <IconButton
                    onClick={decrementPage}
                    disabled={!hasPrev}
                  >
                    <ChevronLeft className="size-6" />
                  </IconButton>
                  <IconButton
                    onClick={incrementPage}
                    disabled={!hasNext}
                  >
                    <ChevronRight className="size-6" />
                  </IconButton>
                </div>}
            </List.Pagination>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 py-4">
          <PolicyDefinitionsList.Items
            limit={MAX_ITEMS}
            sortOrder="DESC"
          >
            {({ item, index }) => (
              <PolicyCard
                key={index}
                policyDefinition={item}
                onClick={() => openDetailsModal(item)}
              />
            )}
          </PolicyDefinitionsList.Items>
        </div>

        <PolicyDefinitionsList.Loading>
          <div className="max-w-20 mx-auto mt-4 flex flex-col bg-white border shadow-sm rounded-xl p-4 md:p-5">
            <span
              className="animate-spin mx-auto inline-block size-8 border-[3px] border-current border-t-transparent text-blue-600 rounded-full"
              role="status"
              aria-label="loading"
            >
              <span className="sr-only">Loading...</span>
            </span>
          </div>
        </PolicyDefinitionsList.Loading>
      </PolicyDefinitionsList>
    </SideDrawer>
  );
}
