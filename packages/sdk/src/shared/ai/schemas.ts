import { type Static, Type } from "@sinclair/typebox";

export const waitingMessageSchema = Type.Object({
  waitingMessage: Type.String({
    description:
      "Message to display, in the user language, while the agent is creating / editing content. Example: 'Creating themes', 'Creating section', 'Searching images'. Don't use triple dots at the end.",
  }),
});

// Same shape for input and output
export type ToolInputWaitingMessageType = { waitingMessage: string };
export type ToolOutputWaitingMessageType = { waitingMessage: string };
export type ToolInputInstructionsType = { instructions: string };

export const askUserChoiceInput = Type.Object({
  choices: Type.Array(
    Type.String({
      title: "Choice. Will appear as a button label to the user. Don't make it too long for a button label.",
      minLength: 1,
    }),
    {
      description: `The list of choices to present to the user.
For yes/no questions, use 'Yes' and 'No' as choices. (translated to user language).
For other multiple choice questions, always include one LAST choice for 'Other' or 'None of these' as a last choice to let the user manually input their own answer if none of the predefined choices fit.`,
      maxItems: 7,
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
