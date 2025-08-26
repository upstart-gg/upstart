import type { PageAttributes } from "../attributes";

export type DatasourceFetcherParams<
  OAuthProps = unknown,
  Opts extends Record<string, unknown> = Record<string, unknown>,
> = {
  options: Opts;
  pageAttributes: PageAttributes;
  oauth: OAuthProps;
};

export type DatasourceFetcher<
  T = unknown,
  OAuthOpts = unknown,
  Opts extends Record<string, unknown> = Record<string, unknown>,
> = (params: DatasourceFetcherParams<OAuthOpts, Opts>) => Promise<T>;
