import { createContext, useContext } from "react";
import type { TArray, TObject, TSchema } from "@sinclair/typebox";
import { Text } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";

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
      <ul id={`${schema.name}_level-${nestingLevel}`} className="mb-1">
        {schema.type === "object" ? (
          <SchemaObject schema={schema as TObject} />
        ) : (
          <li className="flex items-center gap-1 w-full ">
            <Text size="3">&#x2022;</Text>
            <Text
              size="2"
              onClick={() => onFieldSelect(schema.name)}
              className="hover:bg-upstart-50 cursor-pointer px-1 py-0.5 rounded"
            >
              {schema.title}
            </Text>
            <Text color="gray" size="1" className="ml-1">
              ({schema.name})
            </Text>
            {/* {schema.optional && (
              <Text color="gray" size="1" className="ml-auto justify-self-end">
                (optional)
              </Text>
            )} */}
          </li>
        )}
      </ul>
    </NestingContext.Provider>
  );
}

function SchemaObject({ schema: { name, required, properties } }: { schema: TObject }) {
  if (properties)
    return (
      <ul className="list-disc">
        <li className={tx({ hidden: !name })}>
          <span>{name}</span>
        </li>
        {Object.entries(properties)
          .sort(([p1], [p2]) => p1.localeCompare(p2))
          .map(([name, value], i) => (
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
        <SchemaEntry schema={schema.items} />
      </NestingContext.Provider>
    </ChoiceContext.Provider>
  );
}
