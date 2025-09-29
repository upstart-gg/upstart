import type { Brick, Section as SectionType } from "@upstart.gg/sdk/shared/bricks";
import BrickWrapper from "./BrickWrapper";
import { useSectionStyle } from "~/shared/hooks/use-section-style";

type EditableSectionProps = {
  section: SectionType;
};

export default function Section({ section }: EditableSectionProps) {
  const className = useSectionStyle({ section });
  return (
    <section key={section.id} id={section.id} data-element-kind="section" className={className}>
      {(section.bricks as Brick[]).map((brick) => {
        return <BrickWrapper key={brick.id} brick={brick} />;
      })}
    </section>
  );
}
