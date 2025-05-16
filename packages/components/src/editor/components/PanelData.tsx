import {
  Tabs,
  Button,
  Callout,
  TextArea,
  Spinner,
  Select,
  useAutoAnimate,
  Text,
} from "@upstart.gg/style-system/system";
import { themes } from "@upstart.gg/sdk/shared/themes/all-themes";
import { forwardRef, useState, type ComponentProps, useMemo } from "react";
import { LuArrowRightCircle } from "react-icons/lu";
import { WiStars } from "react-icons/wi";
import { nanoid } from "nanoid";
import { BsStars } from "react-icons/bs";
import { type Theme, themeSchema } from "@upstart.gg/sdk/shared/theme";
import { useDraft } from "~/editor/hooks/use-editor";
import { ColorFieldRow } from "./json-form/fields/color";
import { ScrollablePanelTab } from "./ScrollablePanelTab";
import type { ColorType } from "@upstart.gg/sdk/shared/themes/color-system";
import type { TUnion } from "@sinclair/typebox";
import { tx, css } from "@upstart.gg/style-system/twind";

export default function DataPanel() {
  const draft = useDraft();
  const [genListRef] = useAutoAnimate(/* optional config */);

  return (
    <Tabs.Root defaultValue="datasources">
      <div className={tx("bg-white dark:bg-dark-800")}>
        <Tabs.List className="sticky top-0 z-50 bg-gray-100">
          <Tabs.Trigger value="datasources" className="!flex-1">
            Sources
          </Tabs.Trigger>
          <Tabs.Trigger value="datarecords" className="!flex-1">
            Records
          </Tabs.Trigger>
        </Tabs.List>
      </div>
      <ScrollablePanelTab tab="datasources" className="p-2">
        <Callout.Root size="1">
          <Callout.Text size="1">
            Use data sources to populate your page with dynamic data or render lists of items.
          </Callout.Text>
        </Callout.Root>
        <div>jklzejf</div>
      </ScrollablePanelTab>
      <ScrollablePanelTab tab="datarecords" className="p-2">
        <Callout.Root size="1">
          <Callout.Text size="1" className="text-balance">
            Data records represent data submitted by your visitors through forms.
          </Callout.Text>
        </Callout.Root>
        <div className="mt-1 flex flex-col gap-y-5">
          <fieldset>
            <div className="font-medium text-sm my-2 bg-upstart-100 dark:bg-dark-600 py-1 -mx-2 px-2">
              bla
            </div>
            <div className="text-sm flex flex-col gap-y-4 px-1">hey</div>
          </fieldset>
        </div>
      </ScrollablePanelTab>
    </Tabs.Root>
  );
}
