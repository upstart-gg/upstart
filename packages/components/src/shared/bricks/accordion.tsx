import { forwardRef } from "react";
import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/accordion.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { useBrickStyle } from "../hooks/use-brick-style";
import { tx, css } from "@upstart.gg/style-system/twind";

const Accordion = forwardRef<HTMLButtonElement, BrickProps<Manifest>>(({ brick }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const { props } = brick;

  return (
    <div className={tx("collapse-container", styles.container)}>
      {props.items.map((item, index) => {
        return (
          <div key={index} className={tx("collapse", props.variants, props.itemsStyles?.fontSize)}>
            {!props.allowMultiple && (
              <input type="radio" name={`accordion-${index}`} defaultChecked={index === 0} />
            )}
            <div className={tx("collapse-title font-semibold")}>{item.title}</div>
            <div className={tx("collapse-content text-[90%]")}>{item.content}</div>
          </div>
        );
      })}
    </div>
  );
});

export default Accordion;
