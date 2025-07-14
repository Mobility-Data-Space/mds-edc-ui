import React from "react";
import {EdcEntityCount} from "@/components/molecules/edc-entity-count.tsx";
import {EdcEntitiesCount} from "@/hooks/use-edc-entities-count.ts";

export interface EdcEntitiesCountProps {
  entitiesCount: EdcEntitiesCount;
}

export function EdcEntitiesCountGrid({ entitiesCount }: EdcEntitiesCountProps): JSX.Element {
  const cardClassName = "min-w-[200px] flex-grow flex-shrink basis-0";
  return (
    <div className="flex flex-row flex-wrap gap-2.5">
      <EdcEntityCount
        data-testid="dashboard-your-data-offers"
        label="dashboard.yourDataOffers"
        count={entitiesCount.dataOffers}
        className={cardClassName}
      />
      <EdcEntityCount
        data-testid="dashboard-your-assets"
        label="dashboard.yourAssets"
        count={entitiesCount.assets}
        className={cardClassName}
      />
      <EdcEntityCount
        data-testid="dashboard-your-policies"
        label="dashboard.yourPolicies"
        count={entitiesCount.policies}
        className={cardClassName}
      />
      <EdcEntityCount
        data-testid="dashboard-preconfigured-catalogs"
        label="dashboard.preconfiguredCatalogs"
        count={entitiesCount.preconfiguredCatalogs}
        className={cardClassName}
      />
      <EdcEntityCount
        data-testid="dashboard-contract-agreements"
        label="dashboard.contractAgreements"
        count={entitiesCount.contractAgreements}
        className={cardClassName}
      />
    </div>
  );
}
