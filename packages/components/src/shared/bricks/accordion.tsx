import type { Manifest } from "@upstart.gg/sdk/bricks/manifests/accordion.manifest";
import type { BrickProps } from "@upstart.gg/sdk/shared/bricks/props/types";
import { tx } from "@upstart.gg/style-system/twind";
import { forwardRef, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import TextContent from "../components/TextContent";
import { useBrickStyle } from "../hooks/use-brick-style";
import { useColorPreset } from "../hooks/use-color-preset";

const Accordion = forwardRef<HTMLButtonElement, BrickProps<Manifest>>(({ brick }, ref) => {
  const styles = useBrickStyle<Manifest>(brick);
  const { props } = brick;
  const items = Array.isArray(props.items) ? props.items : [];
  const { gradientDirection, rounding, ...otherStyles } = styles;
  const presetClasses = useColorPreset<Manifest>(brick);
  // For single mode, we manage the opened item here
  const [itemOpened, setItemOpened] = useState<number | null>(null);
  // For multiple mode, we manage the state of each item in an array
  const [openedItems, setOpenedItems] = useState(() => items.map((item) => !!item.defaultOpen));

  return (
    <div className={tx("flex flex-1 ")}>
      <div
        className={tx(
          "flex flex-1 flex-col overflow-hidden ",
          // presetClasses.border,
          Object.values(otherStyles),
          props.gap,
        )}
      >
        {items.map((item, index) => {
          const isOpen = !props.restrictOneOpen ? openedItems[index] : itemOpened === index;
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
                  "flex flex-1 items-center p-3 gap-1 justify-between w-full",
                  "font-semibold cursor-pointer select-none text-left text-[110%] ",
                  presetClasses.title,
                  gradientDirection,
                  isOpen ? "rounded-b-none border-b" : "",
                  presetClasses.border,
                )}
              >
                <div className={tx("flex flex-1 flex-row items-center gap-1")}>
                  {/* {props.collapse === "collapse-plus" &&
                    (isOpen ? (
                      <MdRemove className={tx("flex-shrink-0 text-[1.2em]")} />
                    ) : (
                      <MdAdd className={tx("flex-shrink-0 text-[1.2em]")} />
                    ))} */}
                  <TextContent
                    propPath={`items.${index}.title`}
                    className={tx("w-full")}
                    brickId={brick.id}
                    content={item.title}
                    editable={true}
                    inline
                  />
                </div>

                {/* {props.collapse === "collapse-arrow" && (
                  <MdKeyboardArrowRight className={tx("transition-transform", isOpen && "rotate-90")} />
                )} */}
                <MdKeyboardArrowRight className={tx("transition-transform", isOpen && "rotate-90")} />
              </button>
              <div
                className={tx("transition-all duration-900 ease-in-out p-3 flex-1", isOpen ? "" : "hidden")}
              >
                <TextContent
                  propPath={`items.${index}.content`}
                  className={tx("w-full")}
                  brickId={brick.id}
                  content={item.content}
                  editable={true}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default Accordion;
