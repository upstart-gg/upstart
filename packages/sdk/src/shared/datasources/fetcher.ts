export type DatasourceFetcherParams<
  OAuthProps = unknown,
  Opts extends Record<string, unknown> = Record<string, unknown>,
> = {
  options: Opts;
  oauth: OAuthProps;
};

export type DatasourceFetcher<
  T = unknown,
  OAuthOpts = unknown,
  Opts extends Record<string, unknown> = Record<string, unknown>,
> = (params: DatasourceFetcherParams<OAuthOpts, Opts>) => Promise<T>;
