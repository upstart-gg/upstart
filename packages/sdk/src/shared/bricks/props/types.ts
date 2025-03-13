import type { Static } from "@sinclair/typebox";
import type { BrickManifest } from "~/shared/brick-manifest";

// Fixed version with proper prop typing
export type BrickProps<M extends BrickManifest> = {
  /**
   * Brick ID.
   */
  id: string;

  /**
   * Overriden props for mobile.
   */
  mobileProps: Partial<Static<M["props"]>>;

  /**
   * Whether the brick is currently being displayed in the editor.
   */
  editable: boolean;
} & Static<M["props"]>;
