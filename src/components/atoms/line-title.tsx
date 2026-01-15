import { T } from "@/i18n";
import { backgroundColor } from "@/theme/ThemeProvider.tsx";
import { Divider } from "@mui/material";
import Typography from "@mui/material/Typography";
import React from "react";

export function LineTitle({ title }: { title: string }): React.ReactElement {

  return (
    <div className="relative flex flex-col justify-center py-3">
      <Divider className="w-full" />
      <div className="absolute text-center w-full">
        <Typography color="textSecondary" variant="body1" component="span" className="px-2.5" style={{ backgroundColor }}>
          <T string={title} />
        </Typography>
      </div>
    </div>
  );
}
