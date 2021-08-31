import React from "react";
import RemarkMathPlugin from "remark-math";
import RehypeKatex from "rehype-katex";
import RemarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

// <https://gist.github.com/mcleonard/0433c1eca1d56489259118524824f159>
export const Markdown = ({
  ...props
}: React.ComponentProps<typeof ReactMarkdown>) => {
  return (
    <ReactMarkdown
      remarkPlugins={[RemarkGfm, RemarkMathPlugin]}
      rehypePlugins={[RehypeKatex]}
      {...props}
    />
  );
};
