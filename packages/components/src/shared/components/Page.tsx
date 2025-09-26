import { usePageStyle } from "~/shared/hooks/use-page-style";
import Section from "./Section";
import { usePageAttributes, useSections, useSiteAttributes } from "~/editor/hooks/use-page-data";

export default function Page() {
  const pageClassName = usePageStyle();
  const sections = useSections();
  const siteAttributes = useSiteAttributes();
  const pageAttributes = usePageAttributes();
  return (
    <>
      <title>{pageAttributes.title}</title>
      <meta name="description" content={pageAttributes.description} />
      <div className={pageClassName}>
        {sections.map((section) => (
          <Section key={section.id} section={section} />
        ))}
        {siteAttributes.bodyTags && (
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Enable raw HTML
          <div dangerouslySetInnerHTML={{ __html: siteAttributes.bodyTags }} />
        )}
        {pageAttributes.additionalTags?.bodyTags && (
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Enable raw HTML
          <div dangerouslySetInnerHTML={{ __html: pageAttributes.additionalTags.bodyTags }} />
        )}
      </div>
    </>
  );
}
