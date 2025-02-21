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
import StarterKit from "@tiptap/starter-kit"; // define your extension array
import TextAlign from "@tiptap/extension-text-align";
import { Callout, IconButton, Popover, Select, ToggleGroup, Portal } from "@upstart.gg/style-system/system";
import { tx } from "@upstart.gg/style-system/twind";
import { useState, useRef, useEffect, useMemo } from "react";
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
import { useDatasourcesSchemas, useEditor, useSelectedBrick } from "~/editor/hooks/use-editor";
import { VscDatabase } from "react-icons/vsc";
import { BiFullscreen, BiExitFullscreen } from "react-icons/bi";
import { JSONSchemaView } from "~/editor/components/json-form/SchemaView";
import Mention from "@tiptap/extension-mention";
import datasourceFieldSuggestions from "./datasourceFieldSuggestions";
import { CgCloseR } from "react-icons/cg";
import { getJSONSchemaFieldsList } from "../utils/json-field-list";
import Highlight from "@tiptap/extension-highlight";

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

export type TextEditorProps = {
  initialContent: string;
  onUpdate: (e: EditorEvents["update"]) => void;
  enabled?: boolean;
  className?: string;
  brickId: Brick["id"];
  discrete?: boolean;
  paragraphMode?: string;
  /**
   * Whether the editor is inlined in the page or appears in the panel
   */
  inline?: boolean;
};

const toolbarBtnCls =
  "!bg-white first:rounded-l last:rounded-r text-sm text-gray-800 px-1 hover:[&:not([data-state=on])]:bg-upstart-100 dark:hover:[&:not([data-state=on])]:(bg-dark-900) leading-none data-[state=on]:(!bg-upstart-600 text-white)";

const TextEditor = ({
  initialContent,
  onUpdate,
  className,
  brickId,
  enabled = false,
  discrete = false,
  paragraphMode,
  inline,
}: TextEditorProps) => {
  const mainEditor = useEditor();
  const datasources = useDatasourcesSchemas();

  const [editable, setEditable] = useState(/*enabled*/ false);
  // @ts-ignore
  const fields = getJSONSchemaFieldsList({ schemas: datasources });

  const extensions = [
    StarterKit.configure({
      ...(paragraphMode === "hero" && {
        document: false,
      }),
    }),
    ...(paragraphMode === "hero" ? [Document.extend({ content: "heading" })] : []),
    TextAlign.configure({
      types: ["heading"],
    }),
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
      content: initialContent,
      onUpdate,
      immediatelyRender: true,

      // autofocus: false,
      editable,
      editorProps: {
        attributes: {
          class: inline
            ? tx(className)
            : tx(
                "max-w-[100%] focus:outline-none focus:border-gray-300 prose prose-sm mx-auto min-h-[46px] dark:(bg-dark-800 text-dark-100) p-2 shadow-[inset_0_1px_2px_rgba(0,0,0,0.1),inset_0_-1px_2px_rgba(0,0,0,0.1)]",
                className,
                mainEditor.textEditMode === "large" && "flex-1 !h-[inherit]",
              ),
        },
      },
      onBlur(props) {
        mainEditor.setlastTextEditPosition(props.editor.state.selection.anchor);
      },
    },
    [brickId, editable, mainEditor.textEditMode],
  );

  useEffect(() => {
    const onFocus = () => {
      mainEditor.setIsEditingText(brickId);
    };

    const onBlur = () => {
      mainEditor.setIsEditingText(false);
      setEditable(false);
    };

    editor?.on("focus", onFocus);
    editor?.on("blur", (e) => {
      if ((e.event.target as HTMLElement)?.matches(".tiptap")) return;
      onBlur();
    });

    return () => {
      editor?.off("focus", onFocus);
      editor?.off("blur", onBlur);
    };
  }, [editor, mainEditor, brickId]);

  return (
    <div
      className={tx({
        "fixed z-[99999] inset-[10dvw] shadow-2xl": mainEditor.textEditMode === "large",
        "-mx-3 -mt-3": discrete,
      })}
    >
      <EditorContent
        onDoubleClick={function (e) {
          // e.preventDefault();
          setEditable(true);
          setTimeout(() => {
            console.log("FOCUSING", editor.view);
            editor?.view.focus();
          }, 200);
        }}
        autoCorrect="false"
        spellCheck="false"
        editor={editor}
        className={tx("outline-none ring-0 ", {
          "min-h-full flex border-0": mainEditor.textEditMode === "large",
        })}
      />
      {editor && editable && (
        // <Portal container={menuContainer.current}>
        <MenuBar
          brickId={brickId}
          editor={editor}
          discrete={discrete}
          inline={inline}
          paragraphMode={paragraphMode}
        />
        // </Portal>
      )}
    </div>
  );
};

const MenuBar = ({
  editor,
  brickId,
  discrete,
  paragraphMode,
  inline,
}: {
  editor: Editor;
  brickId: Brick["id"];
  paragraphMode?: string;
  discrete?: boolean;
  inline?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const selectedBrick = useSelectedBrick();

  const className = tx(
    " flex isolate transition-opacity duration-100",
    "absolute left-0 right-0 text-sm justify-center",
    {
      "opacity-0 hidden": selectedBrick?.id !== brickId,
      "bottom-[calc(100%+8px)]": (selectedBrick?.position.desktop.y ?? 0) > 2,
      "top-[calc(100%+8px)]": (selectedBrick?.position.desktop.y ?? 0) <= 2,
    },
  );

  return (
    <div ref={ref} id="text-editor-menubar" className={tx(className)}>
      <div className="z-[800] flex gap-3 items-center bg-upstart-500 p-2 rounded-md shadow-xl backdrop-blur bg-gradient-to-t from-transparent to-[rgba(255,255,255,0.15)]">
        {paragraphMode !== "hero" && (
          <ButtonGroup>
            <TextSizeSelect editor={editor} />
          </ButtonGroup>
        )}
        <TextAlignButtonGroup editor={editor} />
        <TextStyleButtonGroup editor={editor} />
        <DatasourceItemButton editor={editor} />
        {!inline && <DisplayModeButton icon="enlarge" />}
        {!discrete && inline !== true && (
          <>
            <span className="flex-1" />
            <DisplayModeButton icon="close" />
          </>
        )}
      </div>
    </div>
  );
};

function TextAlignButtonGroup({ editor }: { editor: Editor }) {
  return (
    <ToggleGroup.Root
      className="inline-flex space-x-px divide-x rounded-[3px] divide-gray-300/50 dark:divide-dark-400 h-8"
      type="single"
      value={editor.isActive("textAlign") ? editor.getAttributes("textAlign").alignment : undefined}
      aria-label="Text align"
      color="gray"
    >
      <ToggleGroup.Item
        className={tx(toolbarBtnCls)}
        value="left"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
      >
        <MdFormatAlignLeft className="w-5 h-5" />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={tx(toolbarBtnCls)}
        value="center"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
      >
        <MdFormatAlignCenter className="w-5 h-5" />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={tx(toolbarBtnCls)}
        value="right"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
      >
        <MdFormatAlignRight className="w-5 h-5" />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={tx(toolbarBtnCls)}
        value="justify"
        onClick={() => editor.chain().focus().setTextAlign("justify").run()}
      >
        <MdFormatAlignJustify className="w-5 h-5" />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
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
function DisplayModeButton({ icon }: { icon: "close" | "enlarge" }) {
  const editor = useEditor();
  return (
    <IconButton
      size="1"
      color="gray"
      variant="surface"
      className={tx(toolbarBtnCls)}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        editor.toggleTextEditMode();
      }}
    >
      {!editor.textEditMode || editor.textEditMode === "default" ? (
        icon === "close" ? (
          <CgCloseR className="w-4 h-4 select-none pointer-events-none" />
        ) : (
          <BiFullscreen className="w-4 h-4 select-none pointer-events-none" />
        )
      ) : icon === "close" ? (
        <CgCloseR className="w-4 h-4 select-none pointer-events-none" />
      ) : (
        <BiExitFullscreen className="w-4 h-4 select-none pointer-events-none" />
      )}
    </IconButton>
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
        <IconButton size="2" color="gray" variant="surface" className={tx(toolbarBtnCls)}>
          <VscDatabase className="w-5 h-5" />
        </IconButton>
      </Popover.Trigger>
      <Popover.Content width="460px" side="right" align="center" size="2" maxHeight="50vh" sideOffset={50}>
        <DatasourceFieldPickerModal onFieldSelect={onFieldSelect} />
      </Popover.Content>
    </Popover.Root>
  );
}

function TextStyleButtonGroup({ editor }: { editor: Editor }) {
  return (
    <ToggleGroup.Root
      className="inline-flex space-x-px divide-x rounded-[3px] divide-gray-300/500 dark:divide-dark-400 dark:bg-dark-700 dark:text-dark-200 h-8"
      type="multiple"
      value={
        [
          editor.isActive("bold") ? "bold" : undefined,
          editor.isActive("italic") ? "italic" : undefined,
          editor.isActive("strike") ? "strike" : undefined,
        ].filter(Boolean) as string[]
      }
      aria-label="Text style"
    >
      <ToggleGroup.Item
        className={tx(toolbarBtnCls)}
        value="bold"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <MdFormatBold className="w-5 h-5" />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={tx(toolbarBtnCls)}
        value="italic"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <MdOutlineFormatItalic className="w-5 h-5" />
      </ToggleGroup.Item>
      <ToggleGroup.Item
        className={tx(toolbarBtnCls)}
        value="strike"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <MdStrikethroughS className="w-5 h-5" />
      </ToggleGroup.Item>
    </ToggleGroup.Root>
  );
}

function ButtonGroup({ children, gap = "gap-0" }: { children: React.ReactNode; gap?: string }) {
  return <div className={tx("flex relative", gap)}>{children}</div>;
}

type TextSizeSelectProps = {
  editor: Editor;
};

function TextSizeSelect({ editor }: TextSizeSelectProps) {
  return (
    <Select.Root
      size="2"
      defaultValue={
        editor.isActive("heading")
          ? editor.getAttributes("heading").level?.toString()
          : editor.isActive("code")
            ? "code"
            : "paragraph"
      }
      onValueChange={(level) => {
        if (level === "code") {
          editor.chain().focus().toggleCode().run();
        } else if (level === "paragraph") {
          editor.chain().focus().setParagraph().run();
        } else {
          // @ts-ignore
          editor.chain().focus().toggleHeading({ level: +level }).run();
        }
      }}
    >
      <Select.Trigger className={tx("px-3", toolbarBtnCls)} />
      <Select.Content position="popper">
        <Select.Group>
          <Select.Label>Headings</Select.Label>
          {[1, 2, 3, 4, 5].map((level) => (
            <Select.Item value={level.toString()} key={`level-${level}`}>
              Title {level}
            </Select.Item>
          ))}
        </Select.Group>
        <Select.Separator />
        <Select.Group>
          <Select.Label>Text</Select.Label>
          <Select.Item value="paragraph">Paragraph</Select.Item>
          <Select.Item value="code">Code</Select.Item>
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
}

export default TextEditor;
