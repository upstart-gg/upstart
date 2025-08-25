import type { GenericPageContext } from "@upstart.gg/sdk/shared/page";
import { usePageStyle } from "~/shared/hooks/use-page-style";
import Section from "./Section";
import type { Site } from "@upstart.gg/sdk/shared/site";

export default function Page({ page, site }: { page: GenericPageContext; site: Site }) {
  const pageClassName = usePageStyle({ attributes: page.attributes, typography: page.theme.typography });
  return (
    <div className={pageClassName}>
      {page.sections.map((section) => (
        <Section key={section.id} section={section} />
      ))}
      {site.attributes.bodyTags && (
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Enable raw HTML
        <div dangerouslySetInnerHTML={{ __html: site.attributes.bodyTags }} />
      )}
      {page.attributes.additionalTags?.bodyTags && (
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Enable raw HTML
        <div dangerouslySetInnerHTML={{ __html: page.attributes.additionalTags.bodyTags }} />
      )}
    </div>
  );
}
