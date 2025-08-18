import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { css, tx } from "@upstart.gg/style-system/twind";

type Props = {
  items: string[];
  command: (args: { id: string }) => void;
};

const DatasourceFieldList = forwardRef<HTMLElement, Props>((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command({ id: item });
    }
  };

  const upHandler = () => {
    const newIndex = (selectedIndex + props.items.length - 1) % props.items.length;
    setSelectedIndex(newIndex);
    document
      .querySelector(`[data-ds-id="${newIndex}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const downHandler = () => {
    const newIndex = (selectedIndex + 1) % props.items.length;
    setSelectedIndex(newIndex);
    document
      .querySelector(`[data-ds-id="${newIndex}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => setSelectedIndex(0), [props.items]);

  // @ts-ignore
  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div
      className={tx(
        "bg-white l border border-gray-200 rounded-lg shadow-lg min-w-[280px] flex flex-col gap-0.5 max-h-[200px] overflow-auto p-2 z-auto",
      )}
    >
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            data-ds-id={index}
            type="button"
            // role="menuitem"
            className={tx(
              index === selectedIndex ? "bg-upstart-100" : "hover:bg-upstart-50",
              "flex font-light text-sm text-left w-full items-center px-2 py-1 rounded",
            )}
            key={index}
            onClick={() => selectItem(index)}
          >
            {item}
          </button>
        ))
      ) : (
        <div className="item text-sm">No result</div>
      )}
    </div>
  );
});

export default DatasourceFieldList;
