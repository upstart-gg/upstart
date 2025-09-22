import { Callout } from "@upstart.gg/style-system/system";
import { JSONSchemaView } from "~/editor/components/json-form/SchemaView";
import { tx } from "@upstart.gg/style-system/twind";
import { usePageQueries } from "~/editor/hooks/use-page-data";

type DatasourceFieldPickerModalProps = {
  onFieldSelect: (field: string) => void;
  brickId: string;
  onlyAlias?: string | null;
};

export default function DatasourceFieldPickerModal({
  brickId,
  onlyAlias,
  onFieldSelect,
}: DatasourceFieldPickerModalProps) {
  const pageQueries = usePageQueries();
  if (!pageQueries.length) {
    return (
      <div className="bg-white min-w-52 min-h-80 flex flex-col gap-4">
        No database selected in the dynamic parent brick.
      </div>
    );
  }
  return (
    <div className="bg-white flex flex-col gap-3">
      <h3 className="text-base font-medium">Insert fields from your queries</h3>
      <Callout.Root className="-mx-4 !py-2 !px-3 !rounded-none">
        <Callout.Text size="1" className={tx("text-pretty")}>
          Click on a field to insert it into the text box. Fields are inserted as dynamic placeholders, which
          will be replaced with their actual values when the document is rendered.
        </Callout.Text>
      </Callout.Root>
      <div className="flex flex-col gap-1 pb-2 max-h-[300px] overflow-y-auto scrollbar-thin">
        {pageQueries
          .filter((q) => q.alias === onlyAlias || (!onlyAlias && q.queryInfo.limit === 1))
          .map((query) => (
            <div key={query.alias} className="flex flex-col gap-1">
              <h4 className="text-sm font-semibold">
                {query.alias} - {query.queryInfo?.label}
              </h4>
              <JSONSchemaView
                key={query.alias}
                prefix={query.alias}
                schema={query.datasource.schema}
                onFieldSelect={onFieldSelect}
              />
            </div>
          ))}
      </div>
    </div>
  );
}
