import { tx } from "@upstart.gg/style-system/twind";
import { memo, type ReactNode, type PropsWithChildren } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import remarkCodeMeta from "../../utils/remark-code-meta";

const MemoizedMarkdownBlock = memo(
  ({ content }: { content: string }) => {
    return (
      <div className={tx("prose prose-sm dark:prose-invert max-w-full")}>
        <ReactMarkdown
          components={{
            // @ts-ignore
            choices: ({ node, children, ...props }: PropsWithChildren<{ multiple?: boolean }>) => {
              return <div className={tx("flex flex-wrap gap-2 justify-between my-3")}>{children}</div>;
            },
            // @ts-ignore
            choice: ({ node, children, ...props }: PropsWithChildren<{ other?: boolean }>) => {
              return (
                <button
                  className={tx(
                    "inline-flex text-nowrap text-center justify-center content-center flex-1 text-[.9em] gap-3 items-center font-medium px-3 py-1.5 rounded-md !bg-upstart-700 hover:opacity-90 text-white",
                  )}
                  type="button"
                >
                  {children}
                </button>
              );
            },
          }}
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm, remarkCodeMeta, remarkFrontmatter, remarkMdxFrontmatter]}
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
