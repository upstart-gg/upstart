import { css, tx } from "@upstart.gg/style-system/twind";
import { useGenerationState, useTheme } from "../hooks/use-editor";

export default function BlankWaitPage() {
  const genState = useGenerationState();
  const theme = useTheme();
  // if (genState.hasChosenTheme) {
  //   return (
  //     <div
  //       className={tx(
  //         "absolute inset-0 flex flex-col items-center",
  //         css({
  //           backgroundColor: `linear-gradient(45deg, ${theme.colors.base200} 0%, ${theme.colors.base100} 100%)`,
  //           color: theme.colors.baseContent,
  //         }),
  //       )}
  //     >
  //       {/* fake navbar */}
  //       <div
  //         className={tx(
  //           "w-full h-16 flex items-center justify-center",
  //           css({ backgroundColor: theme.colors.primary, color: theme.colors.primaryContent }),
  //         )}
  //       >
  //         <h1 className="text-2xl font-bold">{theme.name}</h1>
  //       </div>
  //       <h2
  //         className={tx(
  //           "leading-relaxed text-xl font-semibold flex-1 flex justify-center items-center text-center !font-sans",
  //         )}
  //       >
  //         Upsie is working... this can take a while
  //         <br />
  //         Your site will then appear here... 🤩
  //       </h2>
  //     </div>
  //   );
  // }
  return (
    <div
      className={tx("absolute bg-gray-200 top-0 bottom-0 left-0 right-0 flex items-center justify-center")}
    >
      <h2 className={tx("text-gray-400 leading-relaxed text-xl font-semibold flex-1 text-center !font-sans")}>
        Welcome!
        <br />
        To get started, please answer a few questions from our beloved Bot, Upsie.
        <br />
        Your site will then appear here... 🤩
      </h2>
    </div>
  );
}
