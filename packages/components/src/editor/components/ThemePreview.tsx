import { css, tx } from "@upstart.gg/style-system/twind";
import { useDraft } from "../hooks/use-page-data";
import type { Theme } from "@upstart.gg/sdk/shared/theme";

export default function ThemePreview({
  theme,
  noPreview,
  className,
  selected,
  onClick,
}: { theme: Theme; noPreview?: boolean; selected?: boolean; className?: string; onClick?: () => void }) {
  const draft = useDraft();
  return (
    <button
      type="button"
      className={tx(
        "group/theme-button overflow-hidden relative h-[44px] w-full rounded outline shadow-sm  flex flex-grow p-1 gap-1 items-stretch justify-stretch group transition-all",
        css({
          backgroundColor: theme.colors.base100,
          // color: theme.colors.baseContent
        }),
        selected ? "outline-upstart-500" : "outline-gray-200",
        noPreview ? "cursor-default" : "cursor-pointer hover:(outline-upstart-400)",
        className,
      )}
      onClick={noPreview ? undefined : onClick}
    >
      <div
        className={tx(
          "flex-1 rounded-l",
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
      <div
        className={tx(
          "flex-1 rounded-r",
          css({
            backgroundColor: theme.colors.neutral,
          }),
        )}
      />

      <h3
        className={tx(
          noPreview
            ? "-translate-y-1/2 "
            : "translate-y-full scale-75 group-hover/theme-button:(-translate-y-1/2 scale-100)",
          `absolute  left-1/2 -translate-x-1/2 transition-all top-1/2 -bottom-6 h-6
          py-px text-xs max-w-[86%] inline-flex items-center
          overflow-hidden text-ellipsis text-nowrap z-20 bg-black/30 px-2 font-normal text-white backdrop-blur-md rounded-full`,
        )}
      >
        {theme.name}
      </h3>
    </button>
  );
}
