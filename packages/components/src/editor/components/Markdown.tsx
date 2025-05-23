import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return <ReactMarkdown rehypePlugins={[rehypeRaw, remarkBreaks]}>{content}</ReactMarkdown>;
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
  },
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

const Markdown = memo(({ content, id }: { content: string; id: string }) => {
  return <MemoizedMarkdownBlock content={content} key={id} />;
});

export default Markdown;

Markdown.displayName = "MemoizedMarkdown";
