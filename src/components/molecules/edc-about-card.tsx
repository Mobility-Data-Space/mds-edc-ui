import React from "react";
import {Card, CardContent, Box, Typography, ButtonBase} from "@mui/material";
import {T} from "@/i18n";
import {TitleWithIcon} from "@/components/atoms/TitleWithIcon.tsx";
import Link from "next/link";

export function EdcAboutCard(): JSX.Element {
  return (
    <Card >
      <CardContent className="flex flex-col gap-y-4">
        <TitleWithIcon
          title={<T string="dashboard.aboutEdc" />}
          subtitle={<T string="dashboard.edcComponents" />}
        />

        <Typography variant="body2">
          <T string="dashboard.edcAbout1" />
        </Typography>

        <Typography variant="body2">
          <T string="dashboard.edcAbout2" />
        </Typography>

        <Typography variant="body2">
          <T string="dashboard.edcAbout3" />
        </Typography>

        <div>
          <Box sx={{ border: 1, borderColor: "info.main" }} className="inline-flex rounded" >
            <ButtonBase component="span" className="!px-4 !py-1.5" >
              <Link href="https://github.com/eclipse-edc/Connector">
                <Typography color="secondary" variant="subtitle1" component="span" className="!font-medium">
                  GitHub
                </Typography>
              </Link>
            </ButtonBase>
          </Box>
        </div>
      </CardContent>
    </Card>
  );
}
