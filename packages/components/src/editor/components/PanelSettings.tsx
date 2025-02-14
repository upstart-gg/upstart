import { useAttributes, useAttributesSchema, useDraft } from "../hooks/use-editor";
import { sortJsonSchemaProperties } from "~/shared/utils/sort-json-schema-props";
import { tx } from "@upstart.gg/style-system/twind";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FormRenderer, getFormComponents } from "./json-form/form";
import type { Attributes, JSONSchemaType } from "@upstart.gg/sdk/shared/attributes";
import { Tabs, Spinner } from "@upstart.gg/style-system/system";
import { ScrollablePanelTab } from "./ScrollablePanelTab";

import "./json-form/json-form.css";

export default function SettingsForm() {
  const draft = useDraft();
  const attributes = useAttributes();
  const attrSchema = useAttributesSchema();
  const filteredAttrSchema = sortJsonSchemaProperties(attrSchema);
  const [shouldRender, setShouldRender] = useState(false);
  const [currentTab, setCurrentTab] = useState("page-settings");

  const onChange = useCallback(
    (data: Record<string, unknown>, propertyChanged: string) => {
      console.log("changed attr %o", data);
      draft.updateAttributes(data as Attributes);
    },
    [draft.updateAttributes],
  );

  const formElements = useMemo(() => {
    return getFormComponents({
      brickId: "settings",
      formSchema: filteredAttrSchema as JSONSchemaType<unknown>,
      formData: attributes,
      onChange,
      filter(field) {
        return currentTab === "page-settings"
          ? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (field as any)?.["ui:scope"] !== "site"
          : // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (field as any)?.["ui:scope"] === "site";
      },
    });
  }, [currentTab, attributes, filteredAttrSchema, onChange]);

  useEffect(() => {
    // Defer the form rendering to the next frame
    const timeoutId = requestAnimationFrame(() => {
      setShouldRender(true);
    });

    return () => cancelAnimationFrame(timeoutId);
  }, []);

  const LoadingSpinner = () => (
    <div className="flex flex-1 items-center justify-center w-full h-full">
      <Spinner size="3" />
    </div>
  );

  if (!shouldRender) {
    return <LoadingSpinner />;
  }

  return (
    <Tabs.Root defaultValue={currentTab} onValueChange={setCurrentTab}>
      <Tabs.List className={tx("sticky top-0 z-50")}>
        <Tabs.Trigger value="page-settings" className={tx("!flex-1")}>
          Page settings
        </Tabs.Trigger>
        <Tabs.Trigger value="site-settings" className={tx("!flex-1")}>
          Site settings
        </Tabs.Trigger>
      </Tabs.List>
      <ScrollablePanelTab tab="page-settings">
        <form className={tx("px-3 flex flex-col gap-y-2.5 pb-6")}>
          <FormRenderer components={formElements} brickId={"settings"} />
        </form>
      </ScrollablePanelTab>
      <ScrollablePanelTab tab="site-settings">
        <form className={tx("px-3 flex flex-col gap-y-2.5 pb-6")}>
          <FormRenderer components={formElements} brickId={"settings"} />
        </form>
      </ScrollablePanelTab>
    </Tabs.Root>
  );
}
