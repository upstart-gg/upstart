import { type Static, type TObject, Type } from "@sinclair/typebox";
import { BsDatabaseDown } from "react-icons/bs";
import { defineBrickManifest } from "~/shared/brick-manifest";
import { borderRef, roundingRef } from "../props/border";
import { makeContainerProps } from "../props/container";
import { datasource } from "../props/datasource";
import { shadowRef } from "../props/effects";
import { defineProps } from "../props/helpers";
import { paddingRef } from "../props/padding";
import type { BrickProps } from "../props/types";
import { cssLengthRef } from "../props/css-length";
import { directionRef } from "dsField";
import { alignItemsRef, justifyContentRef } from "../props/align";
import { StringEnum } from "~/shared/utils/string-enum";
import { colorPresetRef } from "../props/color-preset";

export const manifest = defineBrickManifest({
  type: "dynamic",
  category: "container",
  name: "Dynamic box",
  description: "A dynamic container that fetches data from your database and constructs bricks from it.",
  isContainer: true,
  defaultWidth: {
    desktop: "auto",
    mobile: "100%",
  },
  defaultHeight: {
    desktop: "auto",
  },
  icon: BsDatabaseDown,
  props: defineProps({
    color: Type.Optional(
      colorPresetRef({
        title: "Color",
      }),
    ),
    gradientDirection: Type.Optional(
      StringEnum(
        [
          "bg-gradient-to-t",
          "bg-gradient-to-r",
          "bg-gradient-to-b",
          "bg-gradient-to-l",
          "bg-gradient-to-tl",
          "bg-gradient-to-tr",
          "bg-gradient-to-br",
          "bg-gradient-to-bl",
        ],
        {
          title: "Gradient direction",
          description: "The direction of the gradient. Only applies when color preset is a gradient.",
          enumNames: [
            "Top",
            "Right",
            "Bottom",
            "Left",
            "Top left",
            "Top right",
            "Bottom right",
            "Bottom left",
          ],
          default: "bg-gradient-to-br",
          "ui:responsive": "desktop",
          "ui:styleId": "styles:gradientDirection",
          metadata: {
            filter: (manifestProps: TObject, formData: Static<Manifest["props"]>) => {
              return formData.color?.includes("gradient") === true;
            },
          },
        },
      ),
    ),
    direction: directionRef({
      default: "flex-row",
      title: "Direction",
      description: "Direction of the box layout",
    }),
    repeatDirection: directionRef({
      default: "flex-row",
      title: "Repeat direction",
      description: "Direction of the repeated items when fetching multiple items from the database",
      "ui:responsive": "desktop",
      metadata: {
        filter: (manifestProps: TObject, formData: Static<Manifest["props"]>) => {
          return (formData.datasource?.limit ?? 1) > 1;
        },
      },
    }),
    justifyContent: Type.Optional(
      justifyContentRef({
        default: "justify-stretch",
      }),
    ),
    alignItems: Type.Optional(
      alignItemsRef({
        default: "items-stretch",
      }),
    ),
    gap: Type.Optional(
      cssLengthRef({
        title: "Gap",
        default: "10px",
        description: "Space between bricks.",
        "ai:instructions":
          "Can be a tailwind gap class like 'gap-1' or 'gap-2', or a custom value like '10px'",
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:gap",
      }),
    ),
    repeatGap: Type.Optional(
      cssLengthRef({
        title: "Repeat gap",
        description: "Space between repeated items when fetching multiple items from the database.",
        default: "10px",
        "ui:placeholder": "Not specified",
        "ui:styleId": "styles:gap",
      }),
    ),
    padding: Type.Optional(
      paddingRef({
        default: "p-2",
      }),
    ),
    rounding: Type.Optional(
      roundingRef({
        default: "rounded-md",
      }),
    ),
    border: Type.Optional(borderRef()),
    shadow: Type.Optional(shadowRef()),
    datasource: Type.Optional(datasource()),
    showDynamicPreview: Type.Optional(
      Type.Boolean({
        title: "Show dynamic preview",
        description: "When enabled, shows a preview of the dynamic bricks that will be created.",
        "ai:hidden": true,
        default: true,
      }),
    ),
    ...makeContainerProps(),
  }),
});

export type Manifest = typeof manifest;

export const examples: {
  description: string;
  type: string;
  props: BrickProps<Manifest>["brick"]["props"];
}[] = [];
