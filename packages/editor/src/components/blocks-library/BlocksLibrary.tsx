import clsx from "clsx";
import { useEditor } from "@enpage/sdk/browser/use-editor";
import * as all from "@enpage/sdk/browser/bricks/all-manifests";
import { Value } from "@sinclair/typebox/value";

export default function BlocksLibrary() {
  const editor = useEditor();
  const isTouchDevice = "ontouchstart" in window;

  return (
    <div className={clsx("flex flex-col overflow-hidden")}>
      <h2 className="py-1.5 px-2 text-sm capitalize bg-gray-200 dark:bg-dark-800 text-gray-600 dark:text-gray-200 flex-1 select-none">
        Library
      </h2>
      <div
        className="grid gap-1.5 p-2"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))",
        }}
      >
        {Object.entries(all).map(([key, blockImport]) => {
          const block = Value.Create(blockImport.manifest);
          return (
            <button
              draggable={isTouchDevice === false}
              key={block.type}
              data-block={encodeURIComponent(JSON.stringify(block))}
              data-manifest={encodeURIComponent(JSON.stringify(blockImport.manifest))}
              type="button"
              className="rounded border border-transparent hover:border-upstart-600 bg-upstart-100
                            dark:bg-dark-700 cursor-grab active:cursor-grabbing touch-none select-none
                            pointer-events-auto"
            >
              {/*
                - pointer-events-none is needed for Safari iOS to work!
              */}
              <div
                className={clsx(
                  "h-full w-full flex flex-col px-1 py-2 items-center gap-0.5 rounded-[inherit] select-none",
                  {
                    "pointer-events-none": isTouchDevice,
                  },
                )}
              >
                <span
                  className="w-7 h-7 text-upstart-600 dark:text-upstart-400 [&>svg]:w-auto [&>svg]:h-7 inline-block"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
                  dangerouslySetInnerHTML={{ __html: block.icon }}
                />
                <span className="whitespace-nowrap text-sm">{block.title}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
