import type { DynamicSettings } from "@upstart.gg/sdk/shared/bricks/props/dynamic";
import { IconButton, SegmentedControl, Select, Switch } from "@upstart.gg/style-system/system";
import type { FC } from "react";
import { BsDatabaseAdd } from "react-icons/bs";
import { useDatarecords } from "~/editor/hooks/use-datarecord";
import { useEditorHelpers } from "~/editor/hooks/use-editor";
import { fieldLabel } from "../form-class";
import type { FieldProps } from "./types";
import { FieldTitle } from "../field-factory";
import { tx } from "@upstart.gg/style-system/twind";

const DynamicField: FC<FieldProps<DynamicSettings | undefined>> = (props) => {
  const { currentValue, onChange, schema } = props;
  const editorHelpers = useEditorHelpers();
  const datarecords = useDatarecords();
  const { query } = currentValue ?? {};

  const onSettingsChange = (newVal: string) => {
    // console.log("LoopField onSettingsChange", newVal);
    // onChange(newVal);
  };

  return (
    <div className="layout-field basis-full">
      <div className="flex items-center justify-between">
        <FieldTitle title={"Dynamic"} />
        {/* <SegmentedControl.Root
          // onValueChange={onChange}
          // defaultValue={currentValue as string}
          size="1"
          radius="medium"
          className="!h-[26px]"
        >
          <SegmentedControl.Item
            value="dynamic"
            className={tx("[&_.rt-SegmentedControlItemLabel]:(px-[7px])")}
          >
            Use dynamic content
          </SegmentedControl.Item>
          <SegmentedControl.Item
            value="static"
            className={tx("[&_.rt-SegmentedControlItemLabel]:(px-[7px])")}
          >
            Use static content
          </SegmentedControl.Item>
        </SegmentedControl.Root> */}
        <Switch
          className="!mt-0.5"
          // checked={!!currentValue?.enabled}
          // onCheckedChange={(checked) => {
          //   onChange({ ...currentValue, enabled: checked });
          // }}
          size="1"
          radius="full"
        />
      </div>
    </div>
  );
};

export default DynamicField;
