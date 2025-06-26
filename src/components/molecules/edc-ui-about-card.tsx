import React from "react";
import {Card, CardContent, Typography} from "@mui/material";
import {T} from "@/i18n";
import {TitleWithIcon} from "@/components/atoms/TitleWithIcon.tsx";
import CheckIcon from '@mui/icons-material/Check';
import Link from "next/link";

function TextWithIcon({ title, link = "", linkTitle = "" }: { title: string, link?: string, linkTitle?: string }) {
  return (
    <div>
      <CheckIcon style={{ fontSize: "14px" }} className="mr-2" />
      <Typography variant="body2" component="span">
        <T string={title} />
      </Typography>
      {link && linkTitle &&
        <Link href={link} className="hover:underline" >
          <Typography variant="body2" component="span">
            {linkTitle}
          </Typography>
        </Link>
      }
    </div>
  );
}

const titles = Object.entries({
  "dashboard.aboutUi": ["", ""],
  "dashboard.aboutUiCatalogViewOffers": ["/catalog-browser", "Catalog Browser"],
  "dashboard.aboutUiCatalogNegotiate": ["/catalog-browser", "Catalog Browser"],
  "dashboard.aboutUiContractsViewExisting": ["/contract-agreements", "Contract Page"],
  "dashboard.aboutUiContractsTransfer": ["/contract-agreements", "Contract Page"],
  "dashboard.aboutUiTransferHistoryView": ["/transfer-processes", "Transfer History Page"],
  "dashboard.aboutUiAssetsViewAndCreate": ["/assets", "Assets Page"],
  "dashboard.aboutUiPoliciesViewAndCreate": ["/policy-definitions", "Policy Page"],
  "dashboard.aboutUiContractDefinitionsViewAndCreate": ["/data-offers", "Data Offer Page"],
});

export function EdcUIAboutCard(): JSX.Element {

  return (
    <Card>
      <CardContent className="flex flex-col gap-y-4">
        <TitleWithIcon
          title={<T string="dashboard.aboutEdcUi"/>}
          subtitle={<T string="dashboard.dataDashboard" />}
        />

        <div className="flex flex-col gap-y-2">
          {titles.map(([title, [link, linkTitle]]) =>
            <TextWithIcon key={title} title={title} link={link} linkTitle={linkTitle} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
