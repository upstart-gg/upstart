import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { tx } from "@upstart.gg/style-system/twind";

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
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
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
        "bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px] flex flex-col gap-0.5 overflow-auto p-2 z-auto",
      )}
    >
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            type="button"
            role="menuitem"
            className={tx(
              index === selectedIndex && "bg-upstart-100",
              "flex text-sm text-left w-full items-center px-1.5 py-1 rounded",
            )}
            key={index}
            onClick={() => selectItem(index)}
          >
            {item}
          </button>
        ))
      ) : (
        <div className="item">No result</div>
      )}
    </div>
  );
});

export default DatasourceFieldList;
