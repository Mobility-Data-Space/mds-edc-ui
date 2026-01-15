import { TitleWithIcon } from "@/components/atoms/TitleWithIcon.tsx";
import { T } from "@/i18n";
import { Box, ButtonBase, Card, CardContent, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

export function EdcAboutCard(): React.ReactElement {
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
