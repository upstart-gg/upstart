import type { GenericPageContext } from "@upstart.gg/sdk/shared/page";
import BrickWrapper from "./BrickWrapper";
import { usePageStyle } from "~/shared/hooks/use-page-style";

export default function Page({ page }: { page: GenericPageContext }) {
  const pageClassName = usePageStyle({ attributes: page.attr, typography: page.theme.typography });
  return (
    <div className={pageClassName}>
      {page.bricks.map((brick) => (
        <BrickWrapper key={brick.id} brick={brick} />
      ))}
    </div>
  );
}
