import React, {useState} from "react";
import {T} from "@/i18n";
import {MarkdownText} from "@/components/atoms/markdown-text.tsx";
import {Button} from "@mui/material";
import KeyboardDoubleArrowDown from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUp from '@mui/icons-material/KeyboardDoubleArrowUp';

export function MarkdownCollapsableText({ data, }: { data: string }): JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <>
      <div className="overflow-hidden relative">
        <MarkdownText data={data} className={isCollapsed ? "h-72" : ""} />
        {!isCollapsed ? "" :
          <div
            className="absolute inset-x-0 bottom-0 z-10 flex h-16 flex-col overflow-hidden"
            style={{
              background: "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.85) 100%)"
            }}
          />
        }
      </div>
      <Button fullWidth color="secondary" onClick={() => setIsCollapsed((oldIsCollapsed) => !oldIsCollapsed)}>
        <div className="flex items-center gap-1 justify-center">
          {isCollapsed ? <KeyboardDoubleArrowDown /> : <KeyboardDoubleArrowUp />}
          <T string={isCollapsed ? "common.showMore" : "common.showLess"} />
        </div>
      </Button>
    </>
  );
}
