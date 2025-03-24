import type { Brick } from "@upstart.gg/sdk/shared/bricks";
import { useGetBrick } from "../hooks/use-editor";
import BrickSettingsView from "./BrickSettingsView";

export default function BrickSettingsGroupMenu({ brickId, group }: { brickId: Brick["id"]; group: string }) {
  const getBrickInfo = useGetBrick();
  const brick = getBrickInfo(brickId);
  if (!brick) {
    return null;
  }
  return (
    <div className="w-[320px]">
      <BrickSettingsView brick={brick} group={group} />
    </div>
  );
}
