import { ReactRenderer } from "@tiptap/react";
import type { MentionNodeAttrs } from "@tiptap/extension-mention";
import tippy, { type GetReferenceClientRect } from "tippy.js";
import DatasourceFieldList from "./DatasourceFieldList";
import type { SuggestionOptions } from "@tiptap/suggestion";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const config: Omit<SuggestionOptions<any, MentionNodeAttrs>, "editor"> = {
  char: "{{",

  render: () => {
    let component: ReactRenderer<typeof DatasourceFieldList>;
    let popup: ReturnType<typeof tippy>;

    return {
      onStart: (props) => {
        // @ts-ignore
        component = new ReactRenderer(DatasourceFieldList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "top-start",
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        // @ts-ignore
        return component.ref?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
};

export default config;
