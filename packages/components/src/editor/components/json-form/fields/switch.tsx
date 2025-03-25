import { IoIosHelpCircleOutline } from "react-icons/io";
import type { FieldProps } from "./types";
import { IconButton, Switch, Text, Tooltip } from "@upstart.gg/style-system/system";
import { fieldLabel } from "../form-class";
import { FieldTitle } from "../field-factory";

const SwitchField: React.FC<FieldProps<boolean>> = (props) => {
  const { onChange, required, title, description, currentValue } = props;

  return (
    <div className="switch-field flex flex-col gap-2 flex-1">
      <div className="flex items-center justify-between">
        <FieldTitle title={title} description={description} />
        <Switch
          onCheckedChange={(value) => onChange(value)}
          size="2"
          variant="soft"
          defaultChecked={currentValue}
        />
      </div>
      {description && (
        <Text as="p" color="gray" size="1">
          {description}
        </Text>
      )}
    </div>
  );
};

export default SwitchField;
