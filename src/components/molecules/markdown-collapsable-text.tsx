import React, {useState, useRef, useEffect} from "react";
import {T} from "@/i18n";
import {MarkdownText} from "@/components/atoms/markdown-text.tsx";
import {Button} from "@mui/material";
import KeyboardDoubleArrowDown from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUp from '@mui/icons-material/KeyboardDoubleArrowUp';

const COLLAPSABLE_HEIGHT_DEFAULT = 280;
interface MarkdowCollapsableTextProps {
  data: string;
  collapsableHeight?: number;
}
export function MarkdownCollapsableText({ data, collapsableHeight = COLLAPSABLE_HEIGHT_DEFAULT }: MarkdowCollapsableTextProps): JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [textHeight, setTextHeight] = useState(0);
  const markdownTextRef = useRef<HTMLDivElement>(null);
  const textShouldBeCollapsable = textHeight > collapsableHeight;

  useEffect(() => {
    setTextHeight((markdownTextRef?.current?.offsetHeight || 0));
  }, [markdownTextRef?.current]);

  return (
    <>
      <div className="overflow-hidden relative">
        <MarkdownText ref={markdownTextRef} data={data} className={isCollapsed && textShouldBeCollapsable ? "h-72" : ""} />
        {isCollapsed && textShouldBeCollapsable &&
          <div
            className="absolute inset-x-0 bottom-0 z-10 flex h-16 flex-col overflow-hidden"
            style={{
              background: "linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.85) 100%)"
            }}
          />
        }
      </div>
      {textShouldBeCollapsable && <Button fullWidth color="secondary" onClick={() => setIsCollapsed((oldIsCollapsed) => !oldIsCollapsed)}>
        <div className="flex items-center gap-1 justify-center">
          {isCollapsed ? <KeyboardDoubleArrowDown /> : <KeyboardDoubleArrowUp />}
          <T string={isCollapsed ? "common.showMore" : "common.showLess"} />
        </div>
      </Button>}
    </>
  );
}
