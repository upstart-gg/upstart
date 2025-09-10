import { type Static, Type } from "@sinclair/typebox";

export const waitingMessageSchema = Type.Object({
  waitingMessage: Type.String({
    description:
      "Message to display, in the user language, while the agent is creating / editing content. Example: 'Creating themes', 'Creating section', 'Searching images'. Don't use triple dots at the end.",
  }),
});

export type WaitingMessageSchema = Static<typeof waitingMessageSchema>;

export const askUserChoiceInput = Type.Object({
  context: Type.String({
    description:
      "The context of the choice. Should be a lowercased word or slug. For example, if the choice is regarding a question about the Sitemap simple, then use 'sitemap'. ",
  }),
  question: Type.Optional(
    Type.String({
      description: "The question to present to the user if not already sent to the user.",
    }),
  ),
  choices: Type.Array(Type.String(), {
    description: "The list of choices to present to the user. Can be a maximum of 6 choices.",
    maxItems: 6,
  }),
  allowMultiple: Type.Optional(
    Type.Boolean({
      description: "Whether to allow multiple choices to be selected",
    }),
  ),
});

export type AskUserChoiceInput = Static<typeof askUserChoiceInput>;
