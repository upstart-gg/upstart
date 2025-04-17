// @ts-nocheck
export default {
  plugins: {
    "postcss-import": {},
    "postcss-preset-env": {},
    ...(process.env.NODE_ENV === "production"
      ? {
          // cssnano: {}, // remove this line to disable cssnano
        }
      : {}),
  },
};
