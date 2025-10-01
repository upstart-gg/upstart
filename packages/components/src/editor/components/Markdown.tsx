import { tx } from "@upstart.gg/style-system/twind";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return (
      <div className={tx("prose prose-sm dark:prose-invert max-w-full")}>
        <ReactMarkdown
          rehypePlugins={[rehypeRaw, remarkGfm]}
          // components={{
          //   table: ({ node, ...props }) => (
          //     <table className={tx("min-w-full table-auto text-xs")} {...props} />
          //   ),
          // }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
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
