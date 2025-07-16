import {
  useEditor as useTextEditor,
  EditorContent,
  type EditorEvents,
  type Editor,
  Extension,
} from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";
import { RiArrowDownSLine, RiBracesLine } from "react-icons/ri";
import TextStyle from "@tiptap/extension-text-style";
import StarterKit from "@tiptap/starter-kit"; // define your extension array
import TextAlign from "@tiptap/extension-text-align";
import Heading from "@tiptap/extension-heading";
import { Callout, Popover, DropdownMenu, Select, ToggleGroup, Portal } from "@upstart.gg/style-system/system";
import {
  useState,
  useEffect,
  useMemo,
  type PropsWithChildren,
  type MouseEventHandler,
  type ElementType,
  type ComponentPropsWithoutRef,
} from "react";
import Document from "@tiptap/extension-document";
import {
  MdFormatBold,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatAlignLeft,
  MdFormatAlignRight,
} from "react-icons/md";
import { MdOutlineFormatItalic } from "react-icons/md";
import { MdStrikethroughS } from "react-icons/md";
import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { useDatasourcesSchemas, useEditor } from "~/editor/hooks/use-editor";
import { JSONSchemaView } from "~/editor/components/json-form/SchemaView";
import Mention from "@tiptap/extension-mention";
import datasourceFieldSuggestions from "./datasourceFieldSuggestions";
import { getJSONSchemaFieldsList } from "../utils/json-field-list";
import Highlight from "@tiptap/extension-highlight";
import { menuBarBtnActiveCls, menuBarBtnCls, menuBarBtnCommonCls } from "../styles/menubar-styles";
import { useTextEditorUpdateHandler } from "~/editor/hooks/use-editable-text";
import type { TSchema } from "@sinclair/typebox";
import { tx } from "@upstart.gg/style-system/twind";

// function DatasourceFieldNode(props: NodeViewProps) {
//   return (
//     <NodeViewWrapper
//       className="datasource-field content bg-upstart-200 px-1 rounded-sm inline-block mx-0.5"
//       as={"span"}
//     >
//       {props.node.attrs.name}
//     </NodeViewWrapper>
//   );
// }

// const fieldsRegex = /(\{\{([^}]+)\}\})/;

const HeroHeading = Heading.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      heroSize: {
        default: "hero-size-1",
        parseHTML: (element) => element.getAttribute("class") || "",
        renderHTML: (attributes) => {
          if (!attributes.heroSize) {
            return {};
          }
          return { class: attributes.heroSize };
        },
      },
    };
  },
});

// const DatasourceFieldExtension = Node.create({
//   // configuration
//   name: "datasourceField",
//   group: "inline",
//   inline: true,
//   addAttributes() {
//     return {
//       name: {
//         default: "unknown",
//       },
//     };
//   },
//   parseHTML() {
//     return [
//       {
//         tag: "datasource-field",
//       },
//     ];
//   },
//   renderHTML({ HTMLAttributes }) {
//     return ["datasource-field", mergeAttributes(HTMLAttributes)];
//   },

//   addNodeView() {
//     return ReactNodeViewRenderer(DatasourceFieldNode, {
//       as: "span",
//     });
//   },
//   addInputRules() {
//     return [
//       nodeInputRule({
//         find: fieldsRegex,
//         type: this.type,
//         getAttributes: (match) => ({ name: match[2] }),
//       }),
//     ];
//   },
// });

type PolymorphicProps<E extends ElementType> = PropsWithChildren<
  ComponentPropsWithoutRef<E> & {
    as?: E;
  }
>;

export type TextEditorProps<E extends ElementType> = PolymorphicProps<E> & {
  content: string;
  className?: string;
  brickId: Brick["id"];
  propPath: string;
  noTextAlign?: boolean;
  noTextStrike?: boolean;
  textSizeMode?: "hero" | "classic" | false;
  /**
   * Whether the editor is inlined in the page or appears in the panel
   */
  inline?: boolean;
};

const OverrideEscape = Extension.create({
  name: "OverrideEscape",
  addKeyboardShortcuts() {
    return {
      Escape: () => this.editor.commands.blur(),
    };
  },
});

const TextEditor = <T extends ElementType = "div">({
  content,
  className,
  brickId,
  inline,
  propPath,
  noTextAlign,
  noTextStrike,
  textSizeMode = "classic",
}: TextEditorProps<T>) => {
  const onUpdate = useTextEditorUpdateHandler(brickId, propPath);
  const mainEditor = useEditor();
  const datasources = useDatasourcesSchemas();
  const [menuBarContainer, setMenuBarContainer] = useState<HTMLDivElement | null>(null);
  const [currentContent, setContent] = useState(content);

  // const [editable, setEditable] = useState(/*enabled*/ false);
  const [focused, setFocused] = useState(false);
  const fields = getJSONSchemaFieldsList(datasources);

  const extensions = [
    StarterKit.configure({
      ...((inline || textSizeMode === "hero") && {
        document: false,
      }),
      dropcursor: {
        class: "drop-cursor",
        color: "#FF9900",
      },
      heading: textSizeMode === "hero" ? false : {},
    }),
    TextStyle.configure({
      mergeNestedSpanStyles: false,
    }),
    Placeholder.configure({
      placeholder: "Write something...",
    }),
    ...(inline ? [Document.extend({ content: "paragraph" })] : []),
    ...(textSizeMode === "hero"
      ? [
          HeroHeading,
          Document.extend({
            content: "heading*",
          }),
        ]
      : []),
    ...(!noTextAlign
      ? [
          TextAlign.configure({
            types: ["heading", "paragraph"],
          }),
        ]
      : []),
    Highlight.configure({ multicolor: true }),
    // DatasourceFieldExtension,
    Mention.configure({
      HTMLAttributes: {
        class: "mention",
      },
      suggestion: {
        ...datasourceFieldSuggestions,
        items: ({ query }) => {
          return fields.filter((field) => field.toLowerCase().includes(query.toLowerCase()));
        },
      },
      renderHTML: ({ options, node }) => {
        // console.log("RENDER ATTRS", options, node);
        const field = node.attrs["data-field"] ?? node.attrs.label ?? node.attrs.id;
        return [
          "span",
          {
            "data-type": "mention",
            class: tx("bg-upstart-500 text-white text-[94%] px-0.5 py-0.5 rounded"),
            "data-field": field,
          },
          `${options.suggestion.char}${field}}}`,
        ];
      },
      renderText: ({ options, node }) => {
        const field = node.attrs["data-field"] ?? node.attrs.label ?? node.attrs.id;
        return `${options.suggestion.char}${field}}}`;
      },
    }),
    OverrideEscape,
  ] as Extension[];

  const editor = useTextEditor(
    {
      extensions,
      content: currentContent,
      onUpdate,
      immediatelyRender: true,
      editable: true,
      editorProps: {
        attributes: {
          class: tx(className),
        },
      },
    },
    [brickId, mainEditor.textEditMode],
  );

  useEffect(() => {
    const onFocus = (e: EditorEvents["focus"]) => {
      // e.event.stopPropagation();
      mainEditor.setIsEditingText(brickId);
      mainEditor.setSelectedBrickId(brickId);
      setFocused(true);
      setTimeout(() => {
        const container = document.querySelector<HTMLDivElement>(`#text-editor-menu-${brickId}`);
        if (container) {
          setMenuBarContainer(container);
        }
      }, 0);
    };

    const onBlur = (e: EditorEvents["blur"]) => {
      // For whatever reason, the editor content is not updated when the blur event is triggered the first time
      // So we need to manually update the content here
      setContent(e.editor.getHTML());

      // If there is a related target, it means the blur event was triggered by a click on the editor buttons
      if (e.event.relatedTarget && !(e.event.relatedTarget as HTMLElement).classList.contains("tiptap")) {
        // setFocused(false);
        console.debug("Editor blur triggered by editor buttons, ignoring", e.event.relatedTarget);
        return;
      }

      console.log("Editor blur", e);

      mainEditor.setIsEditingText(false);
      mainEditor.setLastTextEditPosition(e.editor.state.selection.anchor);

      // Test commenting this out to see if it helps with the focus issue
      // mainEditor.setSelectedBrickId();
      // mainEditor.togglePanel("inspector");

      // reset the selection to the end of the document
      const unselected = e.editor.commands.setTextSelection({
        from: e.editor.state.doc.content.size,
        to: e.editor.state.doc.content.size,
      });

      setFocused(false);
    };

    editor?.on("focus", onFocus);
    editor?.on("blur", onBlur);

    return () => {
      editor?.off("focus", onFocus);
      editor?.off("blur", onBlur);
    };
  }, [editor, mainEditor, brickId]);

  return (
    <>
      <EditorContent
        autoCorrect="false"
        spellCheck="false"
        editor={editor}
        // test not growing the text editor so that the brick can be more easily dragged
        className={tx("outline-none ring-0 flex")}
        // className={tx("outline-none ring-0 min-h-full flex flex-1")}
      />
      {focused && menuBarContainer && (
        <Portal container={menuBarContainer} asChild>
          <TextEditorMenuBar
            editor={editor}
            noTextAlign={noTextAlign}
            noTextStrike={noTextStrike}
            textSizeMode={textSizeMode}
          />
        </Portal>
      )}
    </>
  );
};

const TextEditorMenuBar = ({
  editor,
  textSizeMode,
  noTextAlign,
  noTextStrike,
}: {
  editor: Editor;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
} & Omit<TextEditorProps<any>, "content" | "brickId" | "propPath">) => {
  return (
    <>
      {textSizeMode === "classic" && <TextSizeClassicDropdown editor={editor} />}
      {textSizeMode === "hero" && <TextSizeHeroDropdown editor={editor} />}
      {!noTextAlign && <TextAlignButtonGroup editor={editor} />}
      <TextStyleButtonGroup editor={editor} noTextStrike={noTextStrike} textSizeMode={textSizeMode} />
      <DatasourceItemButton editor={editor} />
    </>
  );
};

const arrowClass = "h-4 w-4 opacity-60 -mr-2";

function TextAlignButtonGroup({ editor }: { editor: Editor }) {
  const [currentAlignment, setCurrentAligment] = useState<string>(
    editor.isActive("textAlign") ? editor.getAttributes("textAlign").alignment : undefined,
  );

  const alignments = {
    left: "Left",
    center: "Center",
    right: "Right",
    justify: "Justify",
  };

  return (
    <DropMenu
      items={[
        ...Object.entries(alignments).map<TopbarMenuItems[number]>(([key, label]) => ({
          label,
          onClick: () => {
            const alignOk = editor.commands.setTextAlign(key);
            // const alignOk = editor.chain().focus().setTextAlign(key).run();
            console.log("alignOk", key, alignOk);
            setCurrentAligment(key);
          },
          type: "checkbox",
          checked: currentAlignment === key,
        })),
      ]}
    >
      <button type="button" className={tx(menuBarBtnCls, menuBarBtnCommonCls)}>
        {!currentAlignment || currentAlignment === "left" ? (
          <MdFormatAlignLeft className={tx("w-5 h-5")} />
        ) : currentAlignment === "center" ? (
          <MdFormatAlignCenter className={tx("w-5 h-5")} />
        ) : currentAlignment === "right" ? (
          <MdFormatAlignRight className={tx("w-5 h-5")} />
        ) : (
          <MdFormatAlignJustify className={tx("w-5 h-5")} />
        )}
        <RiArrowDownSLine className={tx(arrowClass)} />
      </button>
    </DropMenu>
  );
}

type DatasourceFieldPickerModalProps = {
  onFieldSelect: (field: string) => void;
};

function DatasourceFieldPickerModal(props: DatasourceFieldPickerModalProps) {
  const [currentDatasourceId, setCurrentDatasourceId] = useState<string | null>(null);
  const datasources = useDatasourcesSchemas();
  const selectedSchema = useMemo(() => {
    if (!datasources || !currentDatasourceId) return null;
    return datasources[currentDatasourceId].schema;
  }, [currentDatasourceId, datasources]);

  return (
    <div className="bg-white min-w-80 min-h-80 flex flex-col gap-4">
      <h3 className="text-base font-medium">Data sources fields</h3>
      <Callout.Root>
        <Callout.Icon>
          <RiBracesLine />
        </Callout.Icon>
        <Callout.Text>
          Use dynamic data thanks to data sources! Choose a data source field you'd like to display.
        </Callout.Text>
      </Callout.Root>
      <div className="flex flex-col gap-3">
        <div className="inline-flex gap-2 items-center">
          <span className="font-semibold inline-flex justify-center items-center bg-upstart-500 rounded-full w-6 aspect-square text-white">
            1
          </span>
          <span className="text-sm font-medium">Select a data source</span>
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <Select.Root
            defaultValue={currentDatasourceId ?? undefined}
            size="2"
            onValueChange={setCurrentDatasourceId}
          >
            <Select.Trigger radius="large" placeholder="Select a Data source" />
            <Select.Content position="popper">
              <Select.Group>
                <Select.Label>Datasource</Select.Label>
                {Object.entries(datasources ?? {}).map(([dsId, dsSchema]) => (
                  <Select.Item key={dsId} value={dsId}>
                    {dsSchema.name}
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </div>
        {currentDatasourceId && selectedSchema && (
          <>
            <div className="inline-flex gap-2 items-center">
              <span className="font-semibold inline-flex justify-center items-center bg-upstart-500 rounded-full w-6 aspect-square text-white">
                2
              </span>
              <span className="text-sm font-medium">Select a field</span>
            </div>
            <div className="flex items-center justify-between flex-1">
              <JSONSchemaView
                // @ts-ignore
                schema={selectedSchema as TSchema}
                rootName={currentDatasourceId}
                onFieldSelect={props.onFieldSelect}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function DatasourceItemButton({ editor }: { editor: Editor }) {
  const sources = useDatasourcesSchemas();
  const mainEditor = useEditor();
  // const end = editor.state.

  const onFieldSelect = (field: string) => {
    const content = [
      {
        type: "mention",
        attrs: { "data-field": field, label: field },
      },
      {
        type: "text",
        text: ` `,
      },
    ];

    const { size } = editor.view.state.doc.content;

    editor
      .chain()
      .focus()
      .insertContentAt(mainEditor.lastTextEditPosition ?? size, content, {
        parseOptions: {
          preserveWhitespace: "full",
        },
      })
      .run();
  };

  return (
    <Popover.Root>
      <Popover.Trigger>
        <button type="button" className={tx(menuBarBtnCls, menuBarBtnCommonCls)}>
          <RiBracesLine className="w-5 h-5" />
        </button>
      </Popover.Trigger>
      <Popover.Content width="460px" side="right" align="start" size="2" maxHeight="50vh" sideOffset={10}>
        <DatasourceFieldPickerModal onFieldSelect={onFieldSelect} />
      </Popover.Content>
    </Popover.Root>
  );
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type TextStyleButtonGroupProps = Pick<TextEditorProps<any>, "noTextStrike" | "textSizeMode"> & {
  editor: Editor;
};

function TextStyleButtonGroup({ editor, noTextStrike, textSizeMode }: TextStyleButtonGroupProps) {
  const isBold = editor.isActive("bold");
  const isItalic = editor.isActive("italic");
  const isStrike = editor.isActive("strike");
  return (
    <ToggleGroup.Root
      className={tx("flex !shadow-none divide-x divide-gray-200", !textSizeMode && "!rounded-l-none")}
      type="multiple"
      value={
        [
          isBold ? "bold" : undefined,
          isItalic ? "italic" : undefined,
          isStrike ? "strike" : undefined,
        ].filter(Boolean) as string[]
      }
      aria-label="Text style"
    >
      <ToggleGroup.Item
        className={tx(menuBarBtnCls, menuBarBtnCommonCls, "!rounded-l-none", isBold && menuBarBtnActiveCls)}
        value="bold"
        // @ts-ignore
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <MdFormatBold className="w-5 h-5" />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={tx(menuBarBtnCls, menuBarBtnCommonCls, isItalic && menuBarBtnActiveCls)}
        value="italic"
        // @ts-ignore
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <MdOutlineFormatItalic className="w-5 h-5" />
      </ToggleGroup.Item>
      {!noTextStrike && (
        <ToggleGroup.Item
          className={tx(menuBarBtnCls, menuBarBtnCommonCls, "!rounded-none", isStrike && menuBarBtnActiveCls)}
          value="strike"
          // @ts-ignore
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <MdStrikethroughS className="w-5 h-5" />
        </ToggleGroup.Item>
      )}
    </ToggleGroup.Root>
  );
}

type TextSizeClassicDropdownProps = {
  editor: Editor;
};

function TextSizeClassicDropdown({ editor }: TextSizeClassicDropdownProps) {
  const [value, setValue] = useState(
    editor.isActive("heading")
      ? editor.getAttributes("heading").level?.toString()
      : editor.isActive("code")
        ? "code"
        : "paragraph",
  );
  return (
    <DropMenu
      items={[
        {
          label: "Title 1",
          onClick: () => {
            editor.chain().focus().toggleHeading({ level: 1 }).run();
            setValue("1");
          },
          type: "checkbox",
          checked: value === "1",
        },
        {
          label: "Title 2",
          onClick: () => {
            editor.chain().focus().toggleHeading({ level: 2 }).run();
            setValue("2");
          },
          type: "checkbox",
          checked: value === "2",
        },
        {
          label: "Title 3",
          onClick: () => {
            editor.chain().focus().toggleHeading({ level: 3 }).run();
            setValue("3");
          },
          type: "checkbox",
          checked: value === "3",
        },
        {
          label: "Title 4",
          onClick: () => {
            editor.chain().focus().toggleHeading({ level: 4 }).run();
            setValue("4");
          },
          type: "checkbox",
          checked: value === "4",
        },
        {
          label: "Title 5",
          onClick: () => {
            editor.chain().focus().toggleHeading({ level: 5 }).run();
            setValue("5");
          },
          type: "checkbox",
          checked: value === "5",
        },
        {
          type: "separator",
        },
        {
          label: "Paragraph",
          onClick: () => {
            // @ts-ignore
            editor.chain().focus().setParagraph().run();
            setValue("paragraph");
          },
          type: "checkbox",
          checked: value === "paragraph",
        },
        {
          type: "separator",
        },
        {
          label: "Code",
          onClick: () => {
            // @ts-ignore
            editor.chain().focus().toggleCode().run();
            setValue("code");
          },
          type: "checkbox",
          checked: value === "code",
        },
      ]}
    >
      <button type="button" className={tx(menuBarBtnCls, menuBarBtnCommonCls, "!px-3")}>
        <span className="text-[0.85rem] font-medium">
          {value === "code" ? "Code" : value === "paragraph" ? "Paragraph" : `Title ${value}`}
        </span>
        <RiArrowDownSLine className={tx(arrowClass)} />
      </button>
    </DropMenu>
  );
}

type TextSizeHeroDropdownProps = {
  editor: Editor;
};

function TextSizeHeroDropdown({ editor }: TextSizeHeroDropdownProps) {
  const [value, setValue] = useState(editor.getAttributes("heading").class?.toString() ?? "hero-size-1");
  const sizes = [1, 2, 3, 4, 5];
  const labels = ["M", "L", "XL", "2XL", "3XL"];
  const map: Record<string, string> = {
    "hero-size-1": "M",
    "hero-size-2": "L",
    "hero-size-3": "XL",
    "hero-size-4": "2XL",
    "hero-size-5": "3XL",
  };
  return (
    <DropMenu
      items={sizes.map((size, index) => ({
        label: `Hero ${labels[index]}`,
        onClick: () => {
          const isH1 = editor.isActive("heading", { level: 1 });

          if (isH1) {
            // If it's already an h1, just update the style
            editor
              .chain()
              .focus()
              .updateAttributes("heading", { heroSize: `hero-size-${size}` })
              .run();
          }
          setValue(`hero-size-${size}`);
        },
        type: "checkbox",
        checked: value === `hero-size-${size}`,
      }))}
    >
      <button type="button" className={tx(menuBarBtnCls, menuBarBtnCommonCls)}>
        <span className="text-[0.94rem] font-medium capitalize">Hero {map[value]}</span>
        <RiArrowDownSLine className={tx(arrowClass)} />
      </button>
    </DropMenu>
  );
}

type MenuItem = {
  label: string;
  shortcut?: string;
  onClick?: MouseEventHandler;
  type?: never;
};

type MenuCheckbox = {
  label: string;
  checked: boolean;
  shortcut?: string;
  onClick?: MouseEventHandler;
  type: "checkbox";
};

type MenuSeparator = {
  type: "separator";
};
type MenuLabel = {
  type: "label";
  label: string;
};

type TopbarMenuItems = (MenuItem | MenuSeparator | MenuLabel | MenuCheckbox)[];

/**
 */
function DropMenu(props: PropsWithChildren<{ items: TopbarMenuItems; id?: string }>) {
  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className="focus:outline-none" id={props.id}>
        {props.children}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="bottom">
        {props.items.map((item, index) =>
          item.type === "separator" ? (
            <div key={index} className="my-1.5 h-px bg-black/10" />
          ) : item.type === "label" ? (
            <DropdownMenu.Label key={item.label}>{item.label}</DropdownMenu.Label>
          ) : item.type === "checkbox" ? (
            <DropdownMenu.CheckboxItem key={item.label} checked={item.checked}>
              <button
                onClick={item.onClick}
                type="button"
                className="group flex justify-start items-center text-nowrap rounded-[inherit]
                py-1.5 w-fulldark:text-white/90 text-left data-[focus]:bg-upstart-600 data-[focus]:text-white "
              >
                <span className="pr-3">{item.label}</span>
                {item.shortcut && (
                  <kbd
                    className="ml-auto font-sans text-right text-[smaller] text-black/50 dark:text-dark-300
                    group-hover:text-white/90
                      group-data-[focus]:text-white/70 group-data-[active]:text-white/70"
                  >
                    {item.shortcut}
                  </kbd>
                )}
              </button>
            </DropdownMenu.CheckboxItem>
          ) : (
            <DropdownMenu.Item key={item.label}>
              <button
                onClick={item.onClick}
                type="button"
                className="group flex justify-start items-center text-nowrap rounded-[inherit]
                py-1.5 w-fulldark:text-white/90 text-left data-[focus]:bg-upstart-600 data-[focus]:text-white "
              >
                <span className="pr-3">{item.label}</span>
                {item.shortcut && (
                  <kbd
                    className="ml-auto font-sans text-right text-[smaller] text-black/50 dark:text-dark-300
                    group-hover:text-white/90
                      group-data-[focus]:text-white/70 group-data-[active]:text-white/70"
                  >
                    {item.shortcut}
                  </kbd>
                )}
              </button>
            </DropdownMenu.Item>
          ),
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}

export default TextEditor;
