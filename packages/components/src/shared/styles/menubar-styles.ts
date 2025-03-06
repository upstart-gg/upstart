export const menuBarBtnBaseCls = `transition-opacity duration-300 bg-gradient-to-t from-transparent to-[rgba(255,255,255,0.15)]`;

export const menuBarBtnCommonCls = `${menuBarBtnBaseCls}
border-x border-l-upstart-400 border-r-upstart-700
  disabled:hover:from-transparent disabled:hover:to-[rgba(255,255,255,0.15)]
  hover:from-upstart-700 hover:to-white/10
  active:from-upstart-800 active:to-transparent
  disabled:text-white/40
`;

export const menuBarBtnCls = `flex items-center justify-center py-3 gap-x-0.5 px-3.5 group relative
focus-visible:outline-none disabled:hover:cursor-default `;

export const menuBarBtnSquareCls = `aspect-square`;
