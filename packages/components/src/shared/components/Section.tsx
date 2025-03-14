import type { Brick, Section as SectionType } from "@upstart.gg/sdk/shared/bricks";
import BrickWrapper from "./Brick";
import { useSectionStyle } from "~/shared/hooks/use-section-style";

type EditableSectionProps = {
  section: SectionType;
  bricks: Brick[];
};

export default function Section({ section, bricks }: EditableSectionProps) {
  const className = useSectionStyle({ section });
  return (
    <section key={section.id} id={section.id} data-element-kind="section" className={className}>
      {bricks.map((brick, index) => {
        return <BrickWrapper key={brick.id} brick={brick} />;
      })}
    </section>
  );
}
