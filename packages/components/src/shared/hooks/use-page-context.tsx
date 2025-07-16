import type { Attributes } from "@upstart.gg/sdk/shared/attributes";
import type { Theme } from "@upstart.gg/sdk/shared/theme";
import { createContext, useContext, type ReactNode } from "react";

type PageContextType = {
  attributes: Attributes;
  theme: Theme;
  editable?: boolean;
};

const PageContext = createContext<PageContextType | null>(null);

export function PageProvider({
  children,
  attributes,
  theme,
  editable,
}: {
  children: ReactNode;
  attributes: Attributes;
  theme: Theme;
  editable?: boolean;
}) {
  return <PageContext.Provider value={{ attributes, theme, editable }}>{children}</PageContext.Provider>;
}

export function usePageContext() {
  const context = useContext(PageContext);
  if (!context) {
    throw new Error("usePageContext must be used within a PageProvider");
  }
  return context;
}
