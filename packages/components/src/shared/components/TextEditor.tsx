import {
  useEditor as useTextEditor,
  EditorContent,
  type EditorEvents,
  type Editor,
  Extension,
  type Content,
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
  useImperativeHandle,
  forwardRef,
  type PropsWithChildren,
  type MouseEventHandler,
  type ElementType,
  type ComponentPropsWithoutRef,
  startTransition,
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
import { useEditor, useSelectedBrickId } from "~/editor/hooks/use-editor";
import { JSONSchemaView } from "~/editor/components/json-form/SchemaView";
import Mention from "@tiptap/extension-mention";
import datasourceFieldSuggestions from "./datasourceFieldSuggestions";
import { getJSONSchemaFieldsList } from "../utils/json-field-list";
import Highlight from "@tiptap/extension-highlight";
import { menuBarBtnActiveCls, menuBarBtnCls, menuBarBtnCommonCls } from "../styles/menubar-styles";
import { useTextEditorUpdateHandler } from "~/editor/hooks/use-editable-text";
import { tx } from "@upstart.gg/style-system/twind";
import { useDatasource, useDatasources } from "~/editor/hooks/use-datasource";
import { getEditorNodeFromField, insertInEditor } from "../utils/editor-utils";
import { useBrick, useLoopAlias, usePageQueries } from "~/editor/hooks/use-page-data";

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

type PolymorphicProps<E extends ElementType> = PropsWithChildren<
  ComponentPropsWithoutRef<E> & {
    as?: E;
  }
>;

export type TextEditorProps<E extends ElementType> = PolymorphicProps<E> & {
  content: string | undefined;
  className?: string;
  brickId: Brick["id"];
  propPath: string;
  noTextAlign?: boolean;
  noTextStrike?: boolean;
  textSizeMode?: "hero" | "classic" | false;
  placeholder?: string;
  noMenuBar?: boolean;
  /**
   * Whether the editor is inlined in the page or appears in the panel
   */
  inline?: boolean;

  /**
   * Single line text, no line breaks possible
   */
  singleline?: boolean;

  dynamic?: boolean;

  onChange?: (e: EditorEvents["update"]) => void;
};

export type TextEditorRef = {
  editor: Editor | null;
};

const OverrideEscape = Extension.create({
  name: "OverrideEscape",
  addKeyboardShortcuts() {
    return {
      Escape: () => this.editor.commands.blur(),
    };
  },
});

const dynFieldClass = tx("dynamic-field");

function formatInitialContent(content: string | undefined) {
  return (
    content?.replace(/{{(\S+)}}/g, (match, p1) => {
      return `<span data-type="mention" data-id="${p1.trim()}" data-label="${p1.trim()}" class="${dynFieldClass}">${p1.trim()}</span>`;
    }) || ""
  );
}

const TextEditor = forwardRef<TextEditorRef, TextEditorProps<ElementType>>(
  (
    {
      content: initialContent,
      className,
      brickId,
      inline,
      singleline,
      propPath,
      noTextAlign,
      noTextStrike,
      textSizeMode = "classic",
      placeholder,
      noMenuBar,
      dynamic = false,
      onChange,
    },
    ref,
  ) => {
    const defaultUpdateHandler = useTextEditorUpdateHandler(brickId, propPath, dynamic, inline === true);
    const onUpdate = inline ? defaultUpdateHandler : onChange;
    const mainEditor = useEditor();
    const selectedBrickId = useSelectedBrickId();
    const pageQueries = usePageQueries();
    const [menuBarContainer, setMenuBarContainer] = useState<HTMLDivElement | null>(null);
    const [currentContent, setContent] = useState(formatInitialContent(initialContent));
    const [focused, setFocused] = useState(false);
    const queryAlias = useLoopAlias(brickId);
    const datasourceFields = pageQueries
      .filter((q) => q.alias === queryAlias || (!queryAlias && q.queryInfo.limit === 1))
      .flatMap((q) => getJSONSchemaFieldsList(q.datasource.schema, q.alias));

    const extensions = [
      StarterKit.configure({
        // ...(singleline && {
        //   document: false,
        // }),
        document: false,
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
        placeholder: placeholder ?? "My text...",
      }),
      ...(!singleline
        ? [Document.extend({ content: textSizeMode === "hero" ? "heading*" : undefined })]
        : [Document.extend({ content: "paragraph" })]),
      ...(textSizeMode === "hero" ? [HeroHeading] : []),
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
          class: "dynamic-field",
        },
        suggestion: {
          ...datasourceFieldSuggestions,
          items: ({ query }) => {
            return datasourceFields.filter((field) => field.toLowerCase().includes(query.toLowerCase()));
          },
        },

        renderHTML: ({ options, node }) => {
          const field = node.attrs.label ?? node.attrs.id;
          return [
            "span",
            {
              "data-type": "mention",
              class: tx("dynamic-field"),
              "data-label": field,
              "data-id": field,
            },
            `${options.suggestion.char}${field}`.replace(options.suggestion.char as string, ""),
          ];
        },
        renderText: ({ options, node }) => {
          const field = node.attrs.label ?? node.attrs.id;
          return `{{${field}}}`;
        },
      }),
      OverrideEscape,
    ] as Extension[];

    const onFocus = (e: EditorEvents["focus"]) => {
      console.log("Editor focused", e);
      // e.event.stopPropagation();
      mainEditor.setIsEditingText(brickId);
      mainEditor.setSelectedBrickId(brickId);
      setFocused(true);
      if (noMenuBar) {
        return;
      }
      setTimeout(() => {
        const container = document.querySelector<HTMLDivElement>(`#text-editor-menu-${brickId}`);
        if (container) {
          setMenuBarContainer(container);
        }
      }, 0);
    };

    const onBlur = (e: EditorEvents["blur"]) => {
      console.log("Editor blured", e);
      // For whatever reason, the editor content is not updated when the blur event is triggered the first time
      // So we need to manually update the content here
      setContent(e.editor.getHTML());

      // If there is a related target, it means the blur event was triggered by a click on the editor buttons
      if (e.event.relatedTarget && !(e.event.relatedTarget as HTMLElement).classList.contains("tiptap")) {
        // setFocused(false);
        console.debug("Editor blur triggered by editor buttons, ignoring", e.event.relatedTarget);
        return;
      }

      mainEditor.setIsEditingText(false);

      startTransition(() => {
        setFocused(false);
      });
    };

    const editor = useTextEditor(
      {
        extensions,
        content: currentContent,
        onUpdate,
        onBlur,
        onFocus,
        immediatelyRender: true,
        editable: true,
        editorProps: {
          attributes: {
            class: tx(className, singleline && "singleline"),
          },
        },
      },
      [brickId],
    );

    useEffect(() => {
      if (brickId !== selectedBrickId) {
        editor.commands.blur();
      }
    }, [selectedBrickId, brickId, editor]);

    // Expose the editor instance through the ref
    useImperativeHandle(
      ref,
      () => ({
        editor,
      }),
      [editor],
    );

    return (
      <>
        <EditorContent autoCorrect="false" spellCheck="false" editor={editor} className={tx("contents")} />
        {(focused || editor.isFocused) && menuBarContainer && (
          <Portal container={menuBarContainer} asChild>
            <TextEditorMenuBar
              brickId={brickId}
              editor={editor}
              noTextAlign={noTextAlign}
              noTextStrike={noTextStrike}
              textSizeMode={textSizeMode}
            />
          </Portal>
        )}
      </>
    );
  },
);

TextEditor.displayName = "TextEditor";

const TextEditorMenuBar = ({
  editor,
  textSizeMode,
  noTextAlign,
  noTextStrike,
  brickId,
}: {
  editor: Editor;
  brickId: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
} & Omit<TextEditorProps<any>, "content" | "brickId" | "propPath">) => {
  const hasPageQueries = usePageQueries().length > 0;
  return (
    <>
      {textSizeMode === "classic" && <TextSizeClassicDropdown editor={editor} />}
      {textSizeMode === "hero" && <TextSizeHeroDropdown editor={editor} />}
      {!noTextAlign && <TextAlignButtonGroup editor={editor} />}
      <TextStyleButtonGroup editor={editor} noTextStrike={noTextStrike} textSizeMode={textSizeMode} />
      {hasPageQueries && (
        <DatasourceItemButton editor={editor} brickId={brickId}>
          <button type="button" className={tx(menuBarBtnCls, menuBarBtnCommonCls)}>
            <RiBracesLine className="w-5 h-5" />
          </button>
        </DatasourceItemButton>
      )}
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
  brickId: string;
  onlyAlias?: string | null;
};

function DatasourceFieldPickerModal({ brickId, onlyAlias, onFieldSelect }: DatasourceFieldPickerModalProps) {
  const pageQueries = usePageQueries();
  if (!pageQueries.length) {
    return (
      <div className="bg-white min-w-52 min-h-80 flex flex-col gap-4">
        No database selected in the dynamic parent brick.
      </div>
    );
  }
  return (
    <div className="bg-white flex flex-col gap-3">
      <h3 className="text-base font-medium">Insert fields from your queries</h3>
      <Callout.Root className="-mx-4 !py-2 !px-3 !rounded-none">
        <Callout.Text size="1" className={tx("text-pretty")}>
          Click on a field to insert it into the text box. Fields are inserted as dynamic placeholders, which
          will be replaced with their actual values when the document is rendered.
        </Callout.Text>
      </Callout.Root>
      <div className="flex flex-col gap-1 pb-2 max-h-[300px] overflow-y-auto scrollbar-thin">
        {pageQueries
          .filter((q) => q.alias === onlyAlias || (!onlyAlias && q.queryInfo.limit === 1))
          .map((query) => (
            <div key={query.alias} className="flex flex-col gap-1">
              <h4 className="text-sm font-semibold">
                {query.alias} - {query.queryInfo?.label}
              </h4>
              <JSONSchemaView
                key={query.alias}
                prefix={query.alias}
                schema={query.datasource.schema}
                onFieldSelect={onFieldSelect}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export function DatasourceItemButton({
  editor,
  brickId,
  children,
  onFieldClick,
}: PropsWithChildren<{ editor?: Editor | null; brickId: string; onFieldClick?: (field: string) => void }>) {
  const queryAlias = useLoopAlias(brickId);

  console.log("DatasourceItemButton", { brickId, queryAlias });

  const onFieldSelect = (field: string) => {
    onFieldClick?.(field);

    if (!editor) {
      return;
    }

    const content = getEditorNodeFromField(field);
    insertInEditor(editor, content);
  };

  return (
    <Popover.Root>
      <Popover.Trigger>{children}</Popover.Trigger>
      <Popover.Content minWidth="260px" side="top" align="start" size="2" maxHeight="70dvh" sideOffset={10}>
        <DatasourceFieldPickerModal onFieldSelect={onFieldSelect} brickId={brickId} onlyAlias={queryAlias} />
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
