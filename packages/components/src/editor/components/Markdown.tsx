import { tx } from "@upstart.gg/style-system/twind";
import { type ComponentProps, memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkCodeMeta from "../utils/remark-code-meta";

interface CodeProps extends ComponentProps<"code"> {
  node?: {
    properties: {
      dataPath?: string;
      dataTitle?: string;
    };
  };
  className?: string | "language-diff" | "language-json" | "language-tsx" | "language-mdx";
  children?: React.ReactNode;
}

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return (
      <div className={tx("prose prose-sm dark:prose-invert max-w-full")}>
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm, remarkCodeMeta, remarkFrontmatter, remarkMdxFrontmatter]}
          components={{
            code({ node, className, children, ...props }: CodeProps) {
              // wrap it into a <details> block if it's a code block with a language
              return (
                <code className={tx(className)} {...props}>
                  <span className="block font-mono text-xs text-gray-500 mb-1">
                    {className} - {node?.properties?.dataPath}
                  </span>
                  {children}
                </code>
              );
            },
          }}
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
