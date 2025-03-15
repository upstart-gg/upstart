export const menuNavBarCls =
  "h-12 shadow-md rounded-lg bg-upstart-600 flex text-base text-white w-fit justify-start items-stretch";
export const menuBarBtnBaseCls = `transition-opacity duration-300 bg-gradient-to-t from-transparent to-[rgba(255,255,255,0.15)]`;

export const menuBarBtnCommonCls = `${menuBarBtnBaseCls}
relative group overflow-visible
border-x border-l-upstart-400 border-r-upstart-700
  disabled:hover:from-transparent disabled:hover:to-[rgba(255,255,255,0.15)]
  hover:from-upstart-700 hover:to-white/10
  active:from-upstart-800 active:to-transparent
  disabled:text-white/40 first:rounded-l-lg last:rounded-r-lg
`;

export const menuBarBtnCls = `flex items-center justify-center py-3 gap-x-0.5 px-3.5 group relative
focus-visible:outline-none disabled:hover:cursor-default `;

export const menuBarBtnSquareCls = `aspect-square`;

export const menuBarTooltipCls = `absolute py-0.5 px-2.5 bg-upstart-600/80 top-[calc(100%+.5rem)]
rounded-full text-sm text-white min-w-full transition-all delay-75 duration-200 ease-in-out
group-hover:block group-hover:opacity-100 group-hover:translate-y-0 text-nowrap whitespace-nowrap pointer-events-none
z-[99999]
opacity-0

`;
