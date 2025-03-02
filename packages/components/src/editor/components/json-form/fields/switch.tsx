import { tx } from "@upstart.gg/style-system/twind";
import type { FieldProps } from "./types";
import { Switch, Text } from "@upstart.gg/style-system/system";

const SwitchField: React.FC<FieldProps<boolean>> = (props) => {
  const { onChange, required, title, description, currentValue } = props;

  return (
    <div className="switch-field flex flex-col gap-2">
      <div className="flex items-center justify-between">
        {title && (
          <Text as="label" size="2" weight="medium" className="flex-1">
            {title}
          </Text>
        )}
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
