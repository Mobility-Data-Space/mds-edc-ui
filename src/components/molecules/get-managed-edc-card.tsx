import React from "react";
import { Card, CardContent, Box, Typography, ButtonBase } from "@mui/material";
import { T, useTranslator } from "@/i18n";
import { TitleWithIcon } from "@/components/atoms/TitleWithIcon.tsx";
import Link from "next/link";
import { MarkdownText } from "../atoms/markdown-text";

export function GetManagedEDC() {
  const { translator } = useTranslator();

  return (
    <Card>
      <CardContent className="flex flex-col gap-y-4">
        <TitleWithIcon
          title={<T string="dashboard.getManagedEdc" />}
          subtitle={<T string="dashboard.caas" />}
        />

        <div>
          <MarkdownText data={translator("dashboard.caasDescription1")} />
          <MarkdownText data={translator("dashboard.caasDescription2")} />
        </div>

        <div className="flex justify-start items-center gap-3">
          <Box
            sx={{ border: 1, borderColor: "primary.main" }}
            className="inline-flex rounded"
          >
            <ButtonBase
              component="span"
              className="!bg-[#FFFF00] !px-4 !py-1.5 !bg-mds-yellow" //!TODO: Remove hex after #307
            >
              <Link href="https://think-it.io/contact">
                <Typography
                  color="main"
                  variant="subtitle1"
                  component="span"
                  className="!font-medium"
                >
                  Contact
                </Typography>
              </Link>
            </ButtonBase>
          </Box>
          <Box
            sx={{ border: 1, borderColor: "info.main" }}
            className="inline-flex rounded"
          >
            <ButtonBase component="span" className="!px-4 !py-1.5">
              <Link href="https://think-it.io">
                <Typography
                  color="secondary"
                  variant="subtitle1"
                  component="span"
                  className="!font-medium"
                >
                  Think-it
                </Typography>
              </Link>
            </ButtonBase>
          </Box>
        </div>
      </CardContent>
    </Card>
  );
}
