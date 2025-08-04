import { css, tx } from "@upstart.gg/style-system/twind";
import { useDraft } from "../hooks/use-page-data";
import type { Theme } from "@upstart.gg/sdk/shared/theme";

export default function ThemePreview({
  theme,
  noPreview,
  className,
  onClick,
}: { theme: Theme; noPreview?: boolean; className?: string; onClick?: () => void }) {
  const draft = useDraft();
  return (
    <button
      type="button"
      className={tx(
        "relative border aspect-square border-upstart-500 flex flex-col flex-grow gap-1 items-stretch justify-stretch group transition-all",
        css({
          backgroundColor: theme.colors.base100,
          // color: theme.colors.baseContent
        }),
        noPreview ? "cursor-default" : "cursor-pointer hover:(ring-2 ring-upstart-500)",
        className,
      )}
      onClick={noPreview ? undefined : onClick}
    >
      <div
        className={tx(
          "flex-1",
          css({
            backgroundColor: theme.colors.primary,
          }),
        )}
      />
      <div
        className={tx(
          "flex-1",
          css({
            backgroundColor: theme.colors.secondary,
          }),
        )}
      />
      <div
        className={tx(
          "flex-1",
          css({
            backgroundColor: theme.colors.accent,
          }),
        )}
      />

      <h3
        className={tx(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 py-1 text-ellipsis text-nowrap z-20 bg-black/30 px-2 font-medium text-white backdrop-blur-md rounded-full",
        )}
      >
        {theme.name}
      </h3>
      {!noPreview && (
        <span
          className={tx(
            `!opacity-0 w-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
           text-xs text-white font-medium
          justify-end items-center gap-1.5 text-upstart-700 px-2 py-1 bg-upstart-700/80 rounded-md
          group-hover:!opacity-100 transition-opacity duration-150 `,
          )}
        >
          Preview
        </span>
      )}
    </button>
  );
}
