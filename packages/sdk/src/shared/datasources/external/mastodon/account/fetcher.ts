import { type MastodonAccountSchema, mastodonAccountSchema } from "./schema";
import type { MastodonCommonOptions } from "../options";
import { ajv, serializeAjvErrors } from "~/shared/ajv";
import type { DatasourceFetcher } from "~/shared/datasources/fetcher";

const fetchMastodonAccount: DatasourceFetcher<MastodonAccountSchema, null, MastodonCommonOptions> = async ({
  options,
}) => {
  const params = new URLSearchParams({
    acct: options.username,
  });

  const url = `https://mastodon.social/api/v1/accounts/lookup?${params.toString()}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`fetchMastodonAccount Error: Response status: ${response.status}`);
  }

  const account = (await response.json()) as MastodonAccountSchema;
  const isValid = ajv.validate<MastodonAccountSchema>(mastodonAccountSchema, account);

  if (!isValid) {
    throw new Error(
      `fetchMastodonAccount Error: Invalid Mastodon account response data: ${serializeAjvErrors(ajv.errors)}`,
    );
  }

  return account;
};

export default fetchMastodonAccount;
