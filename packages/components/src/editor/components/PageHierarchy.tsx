import { useEditorHelpers, useSections, useSelectedSectionId } from "../hooks/use-editor";
import type { Brick, Section } from "@upstart.gg/sdk/shared/bricks";
import { manifests } from "@upstart.gg/sdk/bricks/manifests/all-manifests";
import { tx } from "@upstart.gg/style-system/twind";
import { PanelBlockTitle } from "./PanelBlockTitle";

export default function PageHierarchy({ brick: selectedBrick }: { brick?: Brick; section: Section }) {
  const { setSelectedBrickId, setSelectedSectionId } = useEditorHelpers();
  const sections = useSections();
  const currentSectionId = useSelectedSectionId();

  function mapBricks(bricks: Brick[], level = 0) {
    return bricks.map((brick) => {
      const childBricks = "$children" in brick.props ? (brick.props.$children as Brick[]) : null;
      const Icon = manifests[brick.type].icon;
      const brickName = manifests[brick.type].name;

      return (
        <div key={brick.id}>
          <div
            className={tx(
              "py-1 rounded-sm user-select-none",
              selectedBrick?.id === brick.id
                ? "bg-upstart-50 dark:bg-white/10 font-bold cursor-default"
                : "hover:bg-gray-50 dark:hover:bg-white/10 cursor-pointer",
            )}
            style={{ paddingLeft: `${level * 16}px` }}
            onClick={(e) => {
              e.stopPropagation();
              console.log("clicking on brick %s", brick.id);
              setSelectedBrickId(brick.id);
            }}
          >
            <div className="flex items-center justify-between gap-px px-1">
              <span className="inline-flex items-center gap-1.5">
                <Icon className="w-4 h-4" /> {brickName}
              </span>
              <span className="text-xs text-gray-400 font-mono lowercase">{brick.id}</span>
            </div>
          </div>

          {childBricks && childBricks.length > 0 && (
            <div className="flex flex-col gap-px">{mapBricks(childBricks, level + 1)}</div>
          )}
        </div>
      );
    });
  }

  return (
    <div className="basis-1/2 grow-0">
      <PanelBlockTitle>Hierarchy</PanelBlockTitle>
      <div className={tx("py-2 px-2 flex flex-col gap-1 text-sm overflow-y-auto scrollbar-thin")}>
        {/* <div className="py-2 px-2 flex flex-col gap-1 text-sm max-h-[calc((100dvh-75px)/2)] overflow-y-auto scrollbar-thin"> */}
        {sections.map((section) => (
          <div key={section.id} className="flex flex-col gap-px">
            <div
              className={tx(
                "py-1 px-1 rounded-sm user-select-none",
                section.id === currentSectionId
                  ? "bg-upstart-50 dark:bg-white/10 font-bold cursor-default"
                  : "hover:bg-gray-50 dark:hover:bg-white/10 cursor-pointer",
              )}
              onClick={() => {
                setSelectedBrickId();
                setSelectedSectionId(section.id);
              }}
            >
              Section {section.label ?? "Unnamed"}
            </div>
            <div className="flex flex-col gap-px ml-2">{mapBricks(section.bricks)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
