import type { LoopSettings } from "@upstart.gg/sdk/shared/bricks/props/dynamic";
import { IconButton, SegmentedControl, Select, Switch, TextField } from "@upstart.gg/style-system/system";
import { useState, type FC } from "react";
import type { FieldProps } from "./types";
import { FieldTitle } from "../field-factory";
import { usePageQueries } from "~/editor/hooks/use-page-data";

const NOLOOP = "$NOLOOP$";

const DynamicField: FC<FieldProps<LoopSettings | undefined>> = (props) => {
  const { currentValue, onChange, schema } = props;
  const { loopOver = NOLOOP } = currentValue ?? {};
  const pageQueries = usePageQueries();
  const query = pageQueries.find((q) => q.alias === loopOver);

  const onQueryChange = (newVal: string) => {
    if (newVal === NOLOOP) {
      onChange(null);
    } else {
      onChange({
        ...(currentValue ?? {}),
        loopOver: newVal,
      });
    }
  };

  if (pageQueries.length === 0) {
    return null;
  }

  return (
    <div className="layout-field w-full flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <FieldTitle
          title={"Loop over"}
          description="Loop over data from a query, repeating the brick for each item."
        />
        <Select.Root defaultValue={loopOver} size="2" onValueChange={onQueryChange}>
          <Select.Trigger radius="medium" variant="ghost" className="!mr-px" />
          <Select.Content position="popper">
            <Select.Item value={NOLOOP}>Do not loop</Select.Item>
            {pageQueries.map((query) => (
              <Select.Item key={query.alias} value={query.alias}>
                {query.alias} - {query.queryInfo?.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
      {typeof currentValue?.loopOver === "string" && (
        <div className="flex items-center justify-between">
          <FieldTitle
            title={"Override limit"}
            description="Override the number of items to loop over. It can only be inferior to the number of items (limit) set by the query."
          />
          <div className="flex items-center">
            <TextField.Root
              size="2"
              type="number"
              min="1"
              max={query?.queryInfo?.limit ?? 50}
              value={currentValue?.overrideLimit ?? ""}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value, 10) : undefined;
                onChange({
                  ...(currentValue ?? {}),
                  overrideLimit: value,
                } as LoopSettings);
              }}
              placeholder="No override"
              className="w-24"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicField;
