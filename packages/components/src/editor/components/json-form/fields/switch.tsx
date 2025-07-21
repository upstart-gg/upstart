import type { FieldProps } from "./types";
import { Switch } from "@upstart.gg/style-system/system";
import { FieldTitle } from "../field-factory";
import type { FC } from "react";

const SwitchField: FC<FieldProps<boolean>> = (props) => {
  const { onChange, required, title, description, currentValue, brickId } = props;

  return (
    <div className="switch-field flex items-center justify-between flex-grow gap-4">
      <FieldTitle title={title} description={description} />
      <Switch
        onCheckedChange={(value) => {
          onChange(value);
        }}
        size="2"
        variant="soft"
        defaultChecked={currentValue}
      />
    </div>
  );
};

export default SwitchField;
