import type { FieldProps } from "./types";
import { Text } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import type { DatasourceSettings } from "@upstart.gg/sdk/shared/bricks/props/common";

const DatasourceField: React.FC<FieldProps<DatasourceSettings>> = (props) => {
  const { onChange, title, currentValue, brickId } = props;

  return (
    <div className="field field-rich-text">
      {title && (
        <div className="flex items-center justify-between">
          <Text as="label" size="2" weight="medium">
            {title}
          </Text>
        </div>
      )}
      <div className={tx("relative")}>foo</div>
    </div>
  );
};

export default DatasourceField;
