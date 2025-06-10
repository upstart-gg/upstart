import { type Static, Type } from "@sinclair/typebox";

export const sitePrompt = Type.String({
  minLength: 30,
  maxLength: 500,
  description: "User prompt for the site, describing the purpose and main features of the site.",
});

export type SitePrompt = Static<typeof sitePrompt>;
