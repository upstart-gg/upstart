import type { FieldProps } from "./types";
import { Switch } from "@upstart.gg/style-system/system";
import { FieldTitle } from "../field-factory";

const SwitchField: React.FC<FieldProps<boolean>> = (props) => {
  const { onChange, required, title, description, currentValue, brickId } = props;

  return (
    <div className="switch-field flex flex-col gap-2 flex-1">
      <div className="flex items-center justify-between">
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
    </div>
  );
};

export default SwitchField;
