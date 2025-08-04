import { motion } from "motion/react";
import type { Theme } from "@upstart.gg/sdk/shared/theme";
import { tx } from "@upstart.gg/style-system/twind";
import type { FC } from "react";
import { useDraftHelpers } from "../hooks/use-page-data";

interface ThemePreviewProps {
  theme: Theme;
}

const ThemePreview: FC<ThemePreviewProps> = ({ theme }) => {
  const colors = theme.colors;
  const { pickTheme } = useDraftHelpers();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const mainColorVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      rotate: 45,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={tx(
        "w-auto aspect-square cursor-pointer h-[200px] border-2 outline-8 mx-auto my-auto flex rounded-2xl relative overflow-hidden",
      )}
      style={{ borderColor: colors.base100, outlineColor: colors.base300 }}
      onClick={() => {
        pickTheme(theme.id);
      }}
    >
      <motion.div
        variants={mainColorVariants}
        whileHover={{ scale: 1.2 }}
        transition={{ type: "spring" }}
        className={tx("absolute -left-1/2 -top-1/2 h-[200%] w-[200%] flex")}
        style={
          {
            // borderColor: colors.baseContent,
          }
        }
      >
        <div className="flex-1 h-full w-full" style={{ backgroundColor: colors.secondary }}>
          &nbsp;
        </div>
        <div className="flex-1 h-full w-full " style={{ backgroundColor: colors.primary }}>
          &nbsp;
        </div>
        <div className="flex-1 h-full w-full" style={{ backgroundColor: colors.accent }}>
          &nbsp;
        </div>
      </motion.div>
      <div
        className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-xl font-extrabold text-center capitalize"
        style={
          {
            // color: colors.primaryContent,
          }
        }
      >
        {theme.name}
      </div>
    </motion.div>
  );
};

export default ThemePreview;
