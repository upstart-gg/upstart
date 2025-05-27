import { memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return <ReactMarkdown rehypePlugins={[rehypeRaw, remarkGfm]}>{content}</ReactMarkdown>;
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) return false;
    return true;
  },
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

const Markdown = memo(({ content }: { content: string }) => {
  return <MemoizedMarkdownBlock content={content} />;
});

export default Markdown;

Markdown.displayName = "MemoizedMarkdown";
