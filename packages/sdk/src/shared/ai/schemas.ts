import { type Static, Type } from "@sinclair/typebox";
import { StringEnum } from "../utils/string-enum";

export const waitingMessageSchema = Type.Object({
  waitingMessage: Type.String({
    description:
      "Message to display, in the user language, while the agent is creating / editing content. Example: 'Creating themes', 'Creating section', 'Searching images'. Don't use triple dots at the end.",
  }),
});

export type ToolInputWaitingMessageType = { waitingMessage: string };
export type ToolInputInstructionsType = { instructions: string };

export const askUserChoiceInput = Type.Object({
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

export const getDocInput = Type.Object(
  {
    entityType: StringEnum(
      [
        "site-attributes",
        "page-attributes",
        "datasource",
        "datarecord",
        "site-query",
        "page-query",
        "section",
        "brick-type",
      ],
      {
        description: "The type of entity to get the schema documentation for.",
      },
    ),
    // Only used when entityType is brick-type
    brickType: Type.Optional(
      Type.String({
        description:
          "The brick type to get the schema documentation for. Required if entityType is 'brick-type'.",
      }),
    ),
  },
  {
    additionalProperties: false,
  },
);

export type GetDocInput = Static<typeof getDocInput>;
