import { createContext, useContext, useState } from "react";
import type { TArray, TObject, TSchema } from "@sinclair/typebox";
import { Text } from "@upstart.gg/style-system/system";
import { tx, css } from "@upstart.gg/style-system/twind";

type ChoiceContextProps = {
  onFieldSelect: (value: string) => void;
  allowArraySelection?: boolean;
};

const NestingContext = createContext(0);
const ChoiceContext = createContext<ChoiceContextProps>({
  onFieldSelect: () => {},
});

function SchemaEntry({ schema }: { schema: TSchema }) {
  const nestingLevel = useContext(NestingContext);
  const { onFieldSelect } = useContext(ChoiceContext);
  return (
    <NestingContext.Provider value={nestingLevel + 1}>
      <ul id={`${schema.name}_level-${nestingLevel}`} className="mb-1 list-[square] pl-2">
        {schema.type === "object" ? (
          <SchemaObject schema={schema as TObject} />
        ) : schema.type === "array" ? (
          <SchemaArray schema={schema as TArray} />
        ) : (
          <li>
            <Text
              size="2"
              onClick={() => onFieldSelect(schema.name)}
              className="hover:bg-upstart-200 bg-upstart-100 cursor-pointer px-1.5 py-1 rounded"
            >
              {schema.name}
            </Text>
            {schema.optional && (
              <Text color="gray" size="1" className="ml-1">
                (optional)
              </Text>
            )}{" "}
            <Text color="gray" size="1">
              ({schema.enum ? `"${schema.enum.join('" | "')}"` : schema.type})
            </Text>
          </li>
        )}
      </ul>
    </NestingContext.Provider>
  );
}

function SchemaArray({ schema }: { schema: TArray }) {
  const { items, name, required } = schema;
  const { onFieldSelect, allowArraySelection } = useContext(ChoiceContext);
  return (
    <ul className="list-[square]">
      {name && (
        <li>
          <Text size="2">
            {allowArraySelection ? (
              <Text size="2" onClick={() => onFieldSelect(name)}>
                {name}
              </Text>
            ) : (
              name
            )}
            {schema.optional && (
              <Text color="gray" size="1" className="ml-1">
                (Optional)
              </Text>
            )}
          </Text>
        </li>
      )}

      <SchemaEntry schema={{ ...items, optional: required && !required.includes(name) }} />
    </ul>
  );
}

function SchemaObject({ schema: { name, required, allOf, properties } }: { schema: TObject }) {
  const renderProperties = properties;
  // if (allOf) {
  //   const newProperties = allOf.reduce((acc, obj) => {
  //     if (obj.properties) {
  //       return {...acc, ...obj.properties}
  //     }
  //   }, {})
  //   console.log(allOf)
  //   if (allOf.oneOf) {
  //     renderProperties = allOf.oneOf.map(variant => ({ ...allOf, ...variant }));
  //   } else {
  //     renderProperties = {...allOf};
  //   }
  //   // console.log(renderProperties);
  // }
  if (properties)
    return (
      <ul className="list-disc">
        <li className={tx({ hidden: !name })}>
          <span>{name}</span>
        </li>
        {Object.entries(renderProperties).map(([name, value], i) => (
          <SchemaEntry
            key={`${name}-${i}`}
            schema={{ ...value, name, optional: required && !required.includes(name) }}
          />
        ))}
      </ul>
    );
  return null;
}

export function JSONSchemaView({
  schema,
  onFieldSelect,
}: { schema: TSchema; onFieldSelect: ChoiceContextProps["onFieldSelect"] }) {
  return (
    <ChoiceContext.Provider value={{ onFieldSelect }}>
      <NestingContext.Provider value={0}>
        <SchemaEntry schema={schema} />
      </NestingContext.Provider>
    </ChoiceContext.Provider>
  );
}
