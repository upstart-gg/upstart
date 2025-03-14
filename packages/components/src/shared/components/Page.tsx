import type { GenericPageContext } from "@upstart.gg/sdk/shared/page";
import { usePageStyle } from "~/shared/hooks/use-page-style";
import Section from "./Section";

export default function Page({ page }: { page: GenericPageContext }) {
  const pageClassName = usePageStyle({ attributes: page.attr, typography: page.theme.typography });
  return (
    <div className={pageClassName}>
      {page.sections.map((section) => (
        <Section
          key={section.id}
          section={section}
          bricks={page.bricks.filter((b) => b.sectionId === section.id)}
        />
      ))}
    </div>
  );
}
