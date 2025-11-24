import { visit } from "unist-util-visit";
import type { Plugin } from "unified";
import type { Root, Code } from "mdast";

// Helper to parse meta string into key-value pairs
function parseMetaString(metaString: string): Record<string, string | boolean> {
  const attrs: Record<string, string | boolean> = {};

  // Match key="value" or key='value' or standalone flags
  const regex = /(\w+)(?:=["']([^"']*)["']|=(\S+))?/g;
  // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
  let match;

  // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
  while ((match = regex.exec(metaString)) !== null) {
    const key = match[1];
    const value = match[2] || match[3]; // quoted or unquoted value
    attrs[key] = value !== undefined ? value : true;
  }

  return attrs;
}

/**
 * Remark plugin to parse code block metadata and add it to the node's data.
 * This makes the metadata available as props in react-markdown components.
 */
const remarkCodeMeta: Plugin<[], Root> = () => {
  return (tree) => {
    visit(tree, "code", (node: Code) => {
      // Parse the meta string if it exists
      if (node.meta) {
        const attrs = parseMetaString(node.meta);

        // Store parsed attributes in the node's data
        // This will be passed through to the HTML/React component
        if (!node.data) {
          node.data = {};
        }

        // Add parsed meta attributes
        // @ts-ignore
        node.data.meta = node.meta; // Keep original
        // @ts-ignore
        node.data.metaAttrs = attrs; // Add parsed version

        // Optionally add hProperties to make them available as HTML attributes
        if (!node.data.hProperties) {
          node.data.hProperties = {};
        }

        // Add data attributes for each meta property
        Object.entries(attrs).forEach(([key, value]) => {
          if (node.data?.hProperties) {
            node.data.hProperties[`data-${key}`] = typeof value === "boolean" ? "" : value;
          }
        });
      }
    });
  };
};

export default remarkCodeMeta;
