import {
  useEditor as useTextEditor,
  EditorContent,
  type EditorEvents,
  type Editor,
  ReactNodeViewRenderer,
  Node,
  NodeViewWrapper,
  type NodeViewProps,
  mergeAttributes,
  nodeInputRule,
} from "@tiptap/react";
import Placeholder from "@tiptap/extension-placeholder";

import { RiArrowDownSLine } from "react-icons/ri";
import StarterKit from "@tiptap/starter-kit"; // define your extension array
import TextAlign from "@tiptap/extension-text-align";
import {
  Callout,
  IconButton,
  Popover,
  DropdownMenu,
  Select,
  ToggleGroup,
  Portal,
} from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
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
import { VscDatabase } from "react-icons/vsc";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";
import { JSONSchemaView } from "~/editor/components/json-form/SchemaView";
import Mention from "@tiptap/extension-mention";
import datasourceFieldSuggestions from "./datasourceFieldSuggestions";
import { CgCloseR } from "react-icons/cg";
import { getJSONSchemaFieldsList } from "../utils/json-field-list";
import Highlight from "@tiptap/extension-highlight";
import {
  menuBarBtnActiveCls,
  menuBarBtnCls,
  menuBarBtnCommonCls,
  menuBarBtnSquareCls,
  menuNavBarCls,
} from "../styles/menubar-styles";
import { useTextEditorUpdateHandler } from "~/editor/hooks/use-editable-text";
import invariant from "@upstart.gg/sdk/shared/utils/invariant";

function DatasourceFieldNode(props: NodeViewProps) {
  return (
    <NodeViewWrapper
      className="datasource-field content bg-upstart-200 px-1 rounded-sm inline-block mx-0.5"
      as={"span"}
    >
      {props.node.attrs.name}
    </NodeViewWrapper>
  );
}

const fieldsRegex = /(\{\{([^}]+)\}\})/;

const DatasourceFieldExtension = Node.create({
  // configuration
  name: "datasourceField",
  group: "inline",
  inline: true,
  addAttributes() {
    return {
      name: {
        default: "unknown",
      },
    };
  },
  parseHTML() {
    return [
      {
        tag: "datasource-field",
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    return ["datasource-field", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(DatasourceFieldNode, {
      as: "span",
    });
  },
  addInputRules() {
    return [
      nodeInputRule({
        find: fieldsRegex,
        type: this.type,
        getAttributes: (match) => ({ name: match[2] }),
      }),
    ];
  },
});

type PolymorphicProps<E extends ElementType> = PropsWithChildren<
  ComponentPropsWithoutRef<E> & {
    as?: E;
  }
>;

export type TextEditorProps<E extends ElementType> = PolymorphicProps<E> & {
  content: string;
  className?: string;
  brickId: Brick["id"];
  paragraphMode?: string;
  propPath: string;
  noTextAlign?: boolean;
  noTextStrike?: boolean;
  noTextType?: boolean;
  /**
   * Whether the editor is inlined in the page or appears in the panel
   */
  inline?: boolean;
};

const TextEditor = <T extends ElementType = "div">({
  content,
  className,
  brickId,
  paragraphMode,
  inline,
  propPath,
  noTextAlign,
  noTextType,
  noTextStrike,
}: TextEditorProps<T>) => {
  const onUpdate = useTextEditorUpdateHandler(brickId, propPath);
  const mainEditor = useEditor();
  const datasources = useDatasourcesSchemas();
  const [menuBarContainer, setMenuBarContainer] = useState<HTMLDivElement | null>(null);
  const [currentContent, setContent] = useState(content);

  // const [editable, setEditable] = useState(/*enabled*/ false);
  const [focused, setFocused] = useState(false);
  // @ts-ignore
  const fields = getJSONSchemaFieldsList({ schemas: datasources });

  const extensions = [
    StarterKit.configure({
      ...(inline && {
        document: false,
      }),
      dropcursor: {
        class: "drop-cursor",
        color: "#FF9900",
      },
    }),
    Placeholder.configure({
      // Use a placeholder:
      placeholder: "Write something …",
      // Use different placeholders depending on the node type:
      // placeholder: ({ node }) => {
      //   if (node.type.name === 'heading') {
      //     return 'What’s the title?'
      //   }

      //   return 'Can you add some further context?'
      // },
    }),
    ...(inline ? [Document.extend({ content: "paragraph" })] : []),
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
  ];

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
        invariant(container, "Menu container not found");
        setMenuBarContainer(container);
      }, 0);
    };

    const onBlur = (e: EditorEvents["blur"]) => {
      console.log("BLURRR");
      // For whatever reason, the editor content is not updated when the blur event is triggered the first time
      // So we need to manually update the content here
      setContent(e.editor.getHTML());

      // If there is a related target, it means the blur event was triggered by a click on the editor buttons
      if (e.event.relatedTarget) {
        console.log("editor blured from related target", e.event.relatedTarget);
        return;
      }

      mainEditor.setIsEditingText(false);
      mainEditor.setlastTextEditPosition(e.editor.state.selection.anchor);

      console.log("setting selection to ", {
        from: e.editor.state.doc.content.size,
        to: e.editor.state.doc.content.size,
      });

      // reset the selection to the end of the document
      const unselected = e.editor.commands.setTextSelection({
        from: e.editor.state.doc.content.size,
        to: e.editor.state.doc.content.size,
      });

      e.editor.commands.blur();

      console.log("unselected", unselected);

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
        className={tx("outline-none ring-0 min-h-full flex flex-1")}
      />
      {focused && menuBarContainer && (
        <Portal container={menuBarContainer} asChild>
          <TextEditorMenuBar
            editor={editor}
            paragraphMode={paragraphMode}
            noTextAlign={noTextAlign}
            noTextType={noTextType}
            noTextStrike={noTextStrike}
          />
        </Portal>
      )}
    </>
  );
};

const TextEditorMenuBar = ({
  editor,
  paragraphMode,
  noTextAlign,
  noTextType,
  noTextStrike,
}: {
  editor: Editor;
  paragraphMode?: string;
  noTextAlign?: boolean;
  noTextType?: boolean;
  noTextStrike?: boolean;
}) => {
  return (
    <>
      {paragraphMode !== "hero" && !noTextType && <TextSizeDropdown editor={editor} />}
      {!noTextAlign && <TextAlignButtonGroup editor={editor} />}
      <TextStyleButtonGroup editor={editor} noTextStrike={noTextStrike} noTextType={noTextType} />
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
    // @ts-ignore
    return datasources[currentDatasourceId].schema;
  }, [currentDatasourceId, datasources]);

  return (
    <div className="bg-white min-w-80 min-h-80 flex flex-col gap-4">
      <h3 className="text-base font-medium">Data sources fields</h3>
      <Callout.Root>
        <Callout.Icon>
          <VscDatabase />
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
                schema={selectedSchema}
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
          <VscDatabase className="w-5 h-5" />
        </button>
      </Popover.Trigger>
      <Popover.Content width="460px" side="right" align="start" size="2" maxHeight="50vh" sideOffset={10}>
        <DatasourceFieldPickerModal onFieldSelect={onFieldSelect} />
      </Popover.Content>
    </Popover.Root>
  );
}

function TextStyleButtonGroup({
  editor,
  noTextStrike,
  noTextType,
}: { editor: Editor; noTextStrike?: boolean; noTextType?: boolean }) {
  const isBold = editor.isActive("bold");
  const isItalic = editor.isActive("italic");
  const isStrike = editor.isActive("strike");
  return (
    <ToggleGroup.Root
      className={tx("flex !shadow-none divide-x", !noTextType && "!rounded-l-none")}
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
        className={tx(
          menuBarBtnCls,
          menuBarBtnCommonCls,
          !noTextType && "!rounded-l-none",
          isBold && menuBarBtnActiveCls,
        )}
        value="bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <MdFormatBold className="w-5 h-5" />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={tx(menuBarBtnCls, menuBarBtnCommonCls, isItalic && menuBarBtnActiveCls)}
        value="italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <MdOutlineFormatItalic className="w-5 h-5" />
      </ToggleGroup.Item>
      {!noTextStrike && (
        <ToggleGroup.Item
          className={tx(menuBarBtnCls, menuBarBtnCommonCls, "!rounded-none", isStrike && menuBarBtnActiveCls)}
          value="strike"
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <MdStrikethroughS className="w-5 h-5" />
        </ToggleGroup.Item>
      )}
    </ToggleGroup.Root>
  );
}

type TextSizeSelectProps = {
  editor: Editor;
};

function TextSizeDropdown({ editor }: TextSizeSelectProps) {
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
            editor.chain().focus().toggleCode().run();
            setValue("code");
          },
          type: "checkbox",
          checked: value === "code",
        },
      ]}
    >
      <button type="button" className={tx(menuBarBtnCls, menuBarBtnCommonCls)}>
        <span className="text-base font-medium">
          {value === "code" ? "Code" : value === "paragraph" ? "Paragraph" : `Title ${value}`}
        </span>
        <RiArrowDownSLine className={tx(arrowClass)} />
      </button>
    </DropMenu>
  );
}

export default TextEditor;
