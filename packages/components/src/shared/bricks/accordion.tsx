import { type Manifest, manifest } from "@upstart.gg/sdk/bricks/manifests/accordion.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import TextContent from "../components/TextContent";
import { useBrickStyle } from "../hooks/use-brick-style";
import { useColorPreset } from "../hooks/use-color-preset";
import BrickRoot from "../components/BrickRoot";

export default function Accordion({ brick, editable }: BrickProps<Manifest>) {
  const styles = useBrickStyle<Manifest>(brick);
  const { props } = brick;
  const items = Array.isArray(props.items) ? props.items : [];
  const { gradientDirection, rounding, ...otherStyles } = styles;
  const presetClasses = useColorPreset<Manifest>(brick);
  // For single mode, we manage the opened item here
  const [itemOpened, setItemOpened] = useState<number | null>(
    items.findIndex((item) => !!item.defaultOpen) || null,
  );
  // For multiple mode, we manage the state of each item in an array
  const [openedItems, setOpenedItems] = useState(() => items.map((item) => !!item.defaultOpen));

  return (
    <BrickRoot
      manifest={manifest}
      className={tx("flex flex-col overflow-hidden relative", Object.values(otherStyles))}
    >
      {editable && items.length === 0 && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center text-center p-8">
          <div className="text-base">Add content to this accordion in the panel</div>
        </div>
      )}
      {items.map((item, index) => {
        const isOpen = !props.restrictOneOpen ? openedItems[index] || item.defaultOpen : itemOpened === index;
        return (
          <div
            key={index}
            className={tx("flex flex-col border", rounding, presetClasses.border, "overflow-hidden")}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => {
                if (!props.restrictOneOpen) {
                  setOpenedItems((prev) => {
                    const next = [...prev];
                    next[index] = !next[index];
                    return next;
                  });
                } else {
                  setItemOpened((prev) => (prev === index ? null : index));
                }
              }}
              className={tx(
                "flex flex-grow shrink-0 items-center p-3 gap-1 justify-between w-full",
                "font-semibold cursor-pointer select-none text-left text-[110%] ",
                presetClasses.title,
                gradientDirection,
                isOpen && "rounded-b-none border-b",
                presetClasses.border,
              )}
            >
              <div className={tx("flex flex-grow shrink-0 flex-row items-center gap-1")}>
                <TextContent
                  propPath={`items.${index}.title`}
                  className={tx("w-full", editable && "cursor-text")}
                  brickId={brick.id}
                  content={item.title}
                  editable={editable}
                  inline
                />
              </div>
              <MdKeyboardArrowRight className={tx("transition-transform", isOpen && "rotate-90")} />
            </button>
            <div className={tx("transition-all duration-900 ease-in-out p-3 flex-1", !isOpen && "hidden")}>
              <TextContent
                propPath={`items.${index}.content`}
                className={tx("w-full", editable && "cursor-text")}
                brickId={brick.id}
                content={item.content}
                editable={editable}
              />
            </div>
          </div>
        );
      })}
    </BrickRoot>
  );
}
