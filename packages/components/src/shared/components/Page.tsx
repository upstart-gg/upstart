import type { GenericPageContext } from "@upstart.gg/sdk/shared/page";
import { PageProvider } from "~/shared/hooks/use-page-context";
import { usePageStyle } from "~/shared/hooks/use-page-style";
import Section from "./Section";

export default function Page({ page }: { page: GenericPageContext }) {
  const pageClassName = usePageStyle({ attributes: page.attr, typography: page.theme.typography });
  return (
    <PageProvider attributes={page.attr} theme={page.theme}>
      <div className={pageClassName}>
        {page.sections.map((section) => (
          <Section key={section.id} section={section} />
        ))}
      </div>
    </PageProvider>
  );
}
