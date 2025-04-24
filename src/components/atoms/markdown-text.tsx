import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export function MarkdownText({ data, className }: { data: string, className: string }): JSX.Element {
  return (
    <div className={`markdown-description ${className}`}>
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} >
        {data}
      </Markdown>
    </div>
  );
}
