import type { PageAttributes } from "../attributes";
import type { ProviderOptions } from "./provider-options";

export type DatasourceFetcherParams<
  OAuthProps = unknown,
  Opts extends Record<string, unknown> = ProviderOptions,
> = {
  options: Opts;
  pageAttributes: PageAttributes;
  oauth: OAuthProps;
};

export type DatasourceFetcher<
  T = unknown,
  OAuthOpts = unknown,
  Opts extends Record<string, unknown> = ProviderOptions,
> = (params: DatasourceFetcherParams<OAuthOpts, Opts>) => Promise<T>;
