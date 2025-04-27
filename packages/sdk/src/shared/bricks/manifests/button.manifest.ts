import { defineBrickManifest } from "~/shared/brick-manifest";
import { defineProps, optional, prop } from "../props/helpers";
import { color, textContent } from "../props/text";
import { RxButton } from "react-icons/rx";
import { StringEnum } from "~/shared/utils/schema";
import { urlOrPageId } from "../props/string";
import { Type } from "@sinclair/typebox";
import { backgroundColor } from "../props/background";
import { padding } from "../props/padding";
import { border } from "../props/border";
import { effects } from "../props/effects";

export const manifest = defineBrickManifest({
  type: "button",
  name: "Button",
  repeatable: true,
  description: "A button with text and optional icon",
  icon: RxButton,
  props: defineProps({
    label: textContent("Label", "My button"),
    type: prop({
      title: "Type",
      schema: Type.Union(
        [
          Type.Literal("button", { title: "Button" }),
          Type.Literal("submit", { title: "Submit" }),
          Type.Literal("reset", { title: "Reset" }),
        ],
        {
          title: "Type",
          description: "The type of the button",
          default: "button",
        },
      ),
    }),
    linkToUrlOrPageId: optional(urlOrPageId("Link")),
    backgroundColor: backgroundColor("bg-primary-70"),
    color: color(),
    padding: optional(padding("p-2")),
    border: optional(border()),
    effects: optional(effects({ enableTextShadow: true })),
  }),
});

export type Manifest = typeof manifest;
