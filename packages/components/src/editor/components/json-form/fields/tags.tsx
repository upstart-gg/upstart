import type { FieldProps } from "./types";
import { FieldTitle } from "../field-factory";
import type { FC } from "react";
import TagsInput from "../../TagsInput";

const TagsField: FC<FieldProps<string[]>> = (props) => {
  const { currentValue, onChange, title, description } = props;

  return (
    <div className="tags-field flex-1 flex flex-col justify-between gap-1 items-start">
      <FieldTitle title={title} description={description} containerClassName="!basis-1/4" />
      <div className="ml-auto flex items-center gap-2 flex-grow w-full">
        <TagsInput
          initialValue={currentValue}
          onChange={onChange}
          className="w-full"
          placeholder="Type something and press enter..."
        />
      </div>
    </div>
  );
};

export default TagsField;
