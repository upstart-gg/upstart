import { type Static, Type } from "@sinclair/typebox";

export const waitingMessageSchema = Type.Object({
  waitingMessage: Type.String({
    description:
      "Message to display, in the user language, while the agent is creating / editing content. Example: 'Creating themes', 'Creating section', 'Searching images'. Don't use triple dots at the end.",
  }),
});

export type WaitingMessageSchema = Static<typeof waitingMessageSchema>;

export const askUserChoiceInput = Type.Object({
  question: Type.String({
    description:
      "The question to ask the user, in the user language. Example: 'Do you want a blog page?' or 'Do you want me to generate some images?'",
  }),
  choices: Type.Array(
    Type.String({
      minLength: 2,
      maxLength: 60,
    }),
    {
      description: "The list of choices to present to the user. Minimum 2 choices, max 6.",
      maxItems: 6,
      minItems: 2,
    },
  ),
  allowMultiple: Type.Optional(
    Type.Boolean({
      description: "Whether to allow multiple choices to be selected by the user. Default to false.",
    }),
  ),
});

export type AskUserChoiceInput = Static<typeof askUserChoiceInput>;
