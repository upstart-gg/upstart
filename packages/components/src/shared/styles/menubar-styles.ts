export const menuNavBarCls = `h-10 shadow-lg rounded-lg bg-white/70 backdrop-blur-md flex text-base
                              text-gray-500 w-fit justify-start items-stretch divide-x divide-gray-300 `;

const menuBarBtnBaseCls = `transition-opacity duration-150 bg-gradient-to-t from-white to-white/70`;

export const menuBarBtnCommonCls = `${menuBarBtnBaseCls}
  relative group overflow-visible
  disabled:hover:from-transparent disabled:hover:to-[rgba(255,255,255,0.15)]
  hover:(from-white/10 to-white/40 text-upstart-800)
  active:(opacity-60)
  disabled:text-white/40 first:rounded-l-lg last:rounded-r-lg`;

export const menuBarBtnActiveCls = `from-upstart-100 to-transparent text-upstart-800`;

export const menuBarBtnCls = `flex items-center justify-center py-3 gap-x-0.5 px-3 group relative
  focus-visible:outline-none disabled:hover:cursor-default `;

export const menuBarBtnSquareCls = `aspect-square`;

export const menuBarTooltipCls = `absolute py-0.5 px-2.5 bg-upstart-600/90 top-[calc(100%+.5rem)]
  rounded-full text-sm text-white min-w-full transition-all delay-75 duration-200 ease-in-out
  group-hover:block group-hover:opacity-100 group-hover:translate-y-0 text-nowrap whitespace-nowrap
  pointer-events-none z-[99999] opacity-0`;
