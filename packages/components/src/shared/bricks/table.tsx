import { manifest, type Manifest } from "@upstart.gg/sdk/shared/bricks/manifests/table.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import { useBrickStyle } from "../hooks/use-brick-style";
import BrickRoot from "../components/BrickRoot";
import { useBrickProps } from "../hooks/use-brick-props";

type TableColumn = {
  field: string;
  header: string;
  type?: string;
  align?: string;
  width?: string;
};

type TableRow = Record<string, unknown>;

export default function Table(props_: BrickProps<Manifest>) {
  const { brick, editable } = props_;
  const brickProps = useBrickProps(props_);
  const styles = useBrickStyle<Manifest>(brick);

  const columns = (brickProps.columns || []) as TableColumn[];
  const rows = (brickProps.rows || []) as TableRow[];
  const showHeader = brickProps.showHeader !== false;
  const striped = brickProps.striped !== false;
  const hover = brickProps.hover !== false;
  const fontSize = brickProps.fontSize || "text-sm";

  // Helper function to format cell content based on column type
  const formatCellContent = (value: unknown, columnType?: string): string => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    switch (columnType) {
      case "currency": {
        // Try to format as currency, fallback to original value
        const numericValue = parseFloat(String(value).replace(/[^0-9.-]/g, ""));
        if (!Number.isNaN(numericValue)) {
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(numericValue);
        }
        return String(value);
      }

      case "date": {
        // Try to format as date, fallback to original value
        const date = new Date(value as string);
        if (!Number.isNaN(date.getTime())) {
          return date.toLocaleDateString();
        }
        return String(value);
      }

      case "link":
      case "image":
        // Return the value as-is for links/images (will be handled in render)
        return String(value);

      default:
        return String(value);
    }
  };

  // Helper function to render cell content based on column type
  const renderCellContent = (value: unknown, column: TableColumn) => {
    const formattedValue = formatCellContent(value, column.type);

    switch (column.type) {
      case "link": {
        if (formattedValue && formattedValue !== "-") {
          // Check if it's an external URL or internal path
          const isExternal = formattedValue.startsWith("http");
          return (
            <a
              href={formattedValue}
              target={isExternal ? "_blank" : "_self"}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="text-blue-600 hover:text-blue-800 underline"
            >
              View
            </a>
          );
        }
        return <span className="text-gray-400">-</span>;
      }

      case "image": {
        if (formattedValue && formattedValue !== "-") {
          return (
            <img
              src={formattedValue}
              alt=""
              className="w-12 h-12 object-cover rounded"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          );
        }
        return <span className="text-gray-400">-</span>;
      }

      default:
        return <span>{formattedValue}</span>;
    }
  };

  // Helper function to get alignment classes
  const getAlignmentClass = (align?: string) => {
    switch (align) {
      case "center":
        return "text-center";
      case "right":
        return "text-right";
      default:
        return "text-left";
    }
  };

  // Helper function to get column width styles
  const getColumnWidthStyle = (width?: string) => {
    switch (width) {
      case "min":
        return { width: "min-content" };
      case "1fr":
        return { flex: "1" };
      case "2fr":
        return { flex: "2" };
      case "3fr":
        return { flex: "3" };
      default:
        return { width: "auto" };
    }
  };

  if (columns.length === 0) {
    return (
      <BrickRoot
        brick={brick}
        editable={editable}
        manifest={manifest}
        className={tx("flex flex-col grow items-center justify-center text-center", Object.values(styles))}
      >
        <div className="p-8">
          {editable ? "Add columns to this table in the panel" : "No columns configured"}
        </div>
      </BrickRoot>
    );
  }

  return (
    <BrickRoot
      brick={brick}
      editable={editable}
      manifest={manifest}
      className={tx("overflow-x-auto", Object.values(styles))}
    >
      <table className={tx("w-full border-collapse", fontSize)}>
        {showHeader && (
          <thead>
            <tr className="border-b-2 border-gray-200">
              {columns.map((column: TableColumn, index: number) => (
                <th
                  key={index}
                  className={tx(
                    "py-3 px-4 font-semibold text-gray-700 bg-gray-50",
                    getAlignmentClass(column.align),
                    index === 0 && "rounded-tl-lg",
                    index === columns.length - 1 && "rounded-tr-lg",
                  )}
                  style={getColumnWidthStyle(column.width)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 px-4 text-center text-gray-500">
                {editable ? "Add data to this table in the panel" : "No data to display"}
              </td>
            </tr>
          ) : (
            rows.map((row: TableRow, rowIndex: number) => (
              <tr
                key={rowIndex}
                className={tx(
                  "border-b border-gray-100",
                  striped && rowIndex % 2 === 0 && "bg-gray-50/50",
                  hover && "hover:bg-gray-100/50 transition-colors duration-200",
                )}
              >
                {columns.map((column: TableColumn, colIndex: number) => (
                  <td
                    key={colIndex}
                    className={tx(
                      "py-3 px-4",
                      getAlignmentClass(column.align),
                      rowIndex === rows.length - 1 && colIndex === 0 && "rounded-bl-lg",
                      rowIndex === rows.length - 1 && colIndex === columns.length - 1 && "rounded-br-lg",
                    )}
                    style={getColumnWidthStyle(column.width)}
                  >
                    {renderCellContent(row[column.field], column)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </BrickRoot>
  );
}
