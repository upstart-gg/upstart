import { facebookPostSchema, type FacebookPostSchema } from "./schema";
import type { MetaFullOAuthConfig } from "../../meta/oauth/config";
import { UnauthorizedError } from "~/shared/errors";
import type { MetaOptions } from "../../meta/options";
import { stringifyObjectValues } from "../../../utils";
import { ajv, serializeAjvErrors } from "~/shared/ajv";
import type { DatasourceFetcher } from "~/shared/datasources/fetcher";

const fetchFacebookPostDatasource: DatasourceFetcher<
  FacebookPostSchema,
  MetaFullOAuthConfig,
  MetaOptions
> = async ({ options, oauth }) => {
  const params = new URLSearchParams({
    ...stringifyObjectValues(options),
    fields: [
      "from",
      "permalink_url",
      "name",
      "description",
      "caption",
      "id",
      "is_hidden",
      "message",
      "application",
      "object_id",
      "link",
      "is_published",
      "properties",
      "status_type",
      "story",
      "type",
      "actions",
      "call_to_action",
      "child_attachments",
    ].join(","),
    access_token: oauth.config.accessToken,
  });

  const response = await fetch(`https://graph.facebook.com/me/posts?${params}`);

  if (!response.ok) {
    if (response.status === 401) {
      throw new UnauthorizedError(`fetchFacebookPostDatasource Error: Unauthorized.`);
    }
    throw new Error(`fetchFacebookPostDatasource Error: Response status: ${response.status}`);
  }

  const post = (await response.json()) as FacebookPostSchema;

  const validate = ajv.compile<FacebookPostSchema>(facebookPostSchema);

  if (!validate(post)) {
    throw new Error(
      `fetchFacebookPostDatasource Error: Invalid JSON object: ${serializeAjvErrors(validate.errors)}`,
    );
  }

  return post;
};

export default fetchFacebookPostDatasource;
