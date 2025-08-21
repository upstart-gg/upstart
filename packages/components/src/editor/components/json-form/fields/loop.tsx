import type { LoopSettings } from "@upstart.gg/sdk/shared/bricks/props/dynamic";
import { IconButton, SegmentedControl, Select, Switch, TextField } from "@upstart.gg/style-system/system";
import { useState, type FC } from "react";
import type { FieldProps } from "./types";
import { FieldTitle } from "../field-factory";
import { usePageQueries } from "~/editor/hooks/use-page-data";

const NOLOOP = "$NOLOOP$";

const DynamicField: FC<FieldProps<LoopSettings | undefined>> = (props) => {
  const { currentValue, onChange, schema, title, description } = props;
  const { over = NOLOOP } = currentValue ?? {};
  const [overrideLimit, setOverrideLimit] = useState<boolean>(!!currentValue?.overrideLimit);
  const pageQueries = usePageQueries();
  const query = pageQueries.find((q) => q.alias === over);
  const placeholder = schema["ui:placeholder"] ?? "Do not repeat";

  const onQueryChange = (newVal: string) => {
    if (newVal === NOLOOP) {
      onChange(null);
    } else {
      onChange({
        ...(currentValue ?? {}),
        over: newVal,
      });
    }
  };

  if (pageQueries.length === 0) {
    return null;
  }

  const loopableQueries = pageQueries.filter((q) => !q.queryInfo?.limit || q.queryInfo?.limit > 1);

  return (
    <div className="layout-field w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <FieldTitle
          title={title ?? "Repeat over"}
          description={
            description ??
            "repeat the brick for each item returned by the query. If no query is selected, the brick will not repeat."
          }
        />
        <Select.Root defaultValue={over} size="2" onValueChange={onQueryChange}>
          <Select.Trigger
            radius="medium"
            variant="ghost"
            className="!mr-px !max-w-[50%]"
            placeholder={placeholder}
          />
          <Select.Content position="popper">
            <Select.Item value={NOLOOP}>{placeholder}</Select.Item>
            {loopableQueries.map((query) => (
              <Select.Item key={query.alias} value={query.alias}>
                {query.alias} - {query.queryInfo?.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
      {typeof currentValue?.over === "string" && (
        <div className="flex items-center justify-between">
          <FieldTitle
            title={"Override limit"}
            description="Override the number of items to repeat over. It can only be inferior to the number of items (limit) set by the query."
          />
          <div className="flex items-center gap-1.5">
            <Switch
              size="2"
              defaultChecked={overrideLimit}
              onCheckedChange={(checked) => {
                setOverrideLimit(checked);
                if (!checked) {
                  onChange({
                    ...(currentValue ?? {}),
                    overrideLimit: undefined,
                  } as LoopSettings);
                }
              }}
              className="mr-2"
            />
            <TextField.Root
              disabled={!overrideLimit}
              size="2"
              type="number"
              min="1"
              max={query?.queryInfo?.limit ?? 50}
              defaultValue={currentValue?.overrideLimit ?? query?.queryInfo?.limit ?? 10}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
                onChange({
                  ...(currentValue ?? {}),
                  overrideLimit: value,
                } as LoopSettings);
              }}
              className="w-[34px]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicField;
