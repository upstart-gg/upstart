import { createContext, useContext } from "react";
import type { TArray, TObject, TSchema } from "@sinclair/typebox";
import { Text } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import { VscSymbolBoolean, VscSymbolNumeric, VscSymbolString, VscSymbolArray } from "react-icons/vsc";
import { CiCalendarDate } from "react-icons/ci";
import { HiMiniAtSymbol, HiMiniHashtag } from "react-icons/hi2";
import { GoRelFilePath } from "react-icons/go";
import { GoNumber } from "react-icons/go";

type ChoiceContextProps = {
  onFieldSelect: (value: string) => void;
  allowArraySelection?: boolean;
};

const NestingContext = createContext(0);
const ChoiceContext = createContext<ChoiceContextProps>({
  onFieldSelect: () => {},
});

const typesIconsMap: Record<string, React.ReactNode> = {
  string: <VscSymbolString className="text-upstart-600" />,
  number: <GoNumber className="text-upstart-600" />,
  boolean: <VscSymbolBoolean className="text-upstart-600" />,
  array: <VscSymbolArray className="text-upstart-600" />,
  "date-time": <CiCalendarDate className="text-upstart-600" />,
  date: <CiCalendarDate className="text-upstart-600" />,
  email: <HiMiniAtSymbol className="text-upstart-600" />,
  slug: <GoRelFilePath className="text-upstart-600" />,
  nanoid: <HiMiniHashtag className="text-upstart-600" />,
};

function SchemaEntry({ schema, prefix }: { schema: TSchema; prefix: string }) {
  const nestingLevel = useContext(NestingContext);
  const { onFieldSelect } = useContext(ChoiceContext);
  return (
    <NestingContext.Provider value={nestingLevel + 1}>
      <ul id={`${schema.name}_level-${nestingLevel}`} className="mb-1">
        {schema.type === "object" ? (
          <SchemaObject schema={schema as TObject} prefix={prefix} />
        ) : (
          <li className="flex items-center gap-0.5 w-full shrink-0 flex-nowrap">
            <Text size="3">
              {typesIconsMap[schema.format] || typesIconsMap[schema.type] || (
                <span className="text-gray-500">?</span>
              )}
            </Text>
            <Text
              size="2"
              onClick={() => onFieldSelect(`${prefix}.${schema.name}`)}
              className="hover:bg-upstart-50 cursor-pointer px-1 py-0.5 rounded text-nowrap"
            >
              {schema.title}
            </Text>
            <Text color="gray" size="1" className="text-nowrap">
              &mdash; {prefix}.{schema.name}
            </Text>
          </li>
        )}
      </ul>
    </NestingContext.Provider>
  );
}

function SchemaObject({
  schema: { name, required, properties },
  prefix,
}: { schema: TObject; prefix: string }) {
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
              prefix={prefix}
            />
          ))}
      </ul>
    );
  return null;
}

export function JSONSchemaView({
  schema,
  prefix,
  onFieldSelect,
}: { schema: TSchema; onFieldSelect: ChoiceContextProps["onFieldSelect"]; prefix: string }) {
  return (
    <ChoiceContext.Provider value={{ onFieldSelect }}>
      <NestingContext.Provider value={0}>
        <SchemaEntry schema={schema.items} prefix={prefix} />
      </NestingContext.Provider>
    </ChoiceContext.Provider>
  );
}
