import React, { forwardRef } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export const MarkdownText = forwardRef<HTMLDivElement, { data: string, className?: string }>(function MarkdownText({ data, className }, ref) {
  return (
    <div ref={ref} className={`markdown-description ${className || ""}`}>
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} >
        {data}
      </Markdown>
    </div>
  );
});
