import { type MastodonStatusArraySchema, mastodonStatusArraySchema } from "./schema";
import fetchMastodonAccount from "../account/fetcher";
import { UnauthorizedError } from "~/shared/datasources/errors";
import type { MastodonCommonOptions } from "../options";
import type { DatasourceFetcher } from "~/shared/datasources/fetcher";

const fetchMastodonStatus: DatasourceFetcher<
  MastodonStatusArraySchema,
  null,
  MastodonCommonOptions
> = async ({ options, pageAttributes: attr }) => {
  const account = await fetchMastodonAccount({
    options: { username: options.username },
    pageAttributes: attr,
    oauth: null,
  });

  const accountUrl = new URL(account.url);
  const url = `https://${accountUrl.host}/api/v1/accounts/${account.id}/statuses`;

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 401) {
      throw new UnauthorizedError(`fetchMastodonStatus Error: Unauthorized.`);
    }
    throw new Error(`fetchMastodonStatus Error: Response status: ${response.status}`);
  }

  const statuses = (await response.json()) as MastodonStatusArraySchema;

  return statuses;
};

export default fetchMastodonStatus;
