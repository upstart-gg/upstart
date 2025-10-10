import { describe, it, expect, vi, beforeEach } from "vitest";
import fetchMastodonStatus from "../fetcher";
import { UnauthorizedError } from "~/shared/datasources/errors";
import { sample } from "../sample.array";
import fetchMastodonAccount from "../../account/fetcher";
import { sample as accountSample } from "../../account/sample";

// Mock the fetch function and fetchMastodonAccount
global.fetch = vi.fn();
// Mock the entire module
vi.mock("../../account/fetcher", () => ({
  default: vi.fn(),
}));

describe("fetchMastodonStatus", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch Mastodon statuses successfully", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(sample),
    });

    vi.mocked(fetchMastodonAccount).mockResolvedValueOnce(accountSample);

    const result = await fetchMastodonStatus({
      options: { username: "testuser" },
      env: {},
      pageConfig: {},
      oauth: null,
    } as any);

    expect(result).toEqual(sample);
    expect(global.fetch).toHaveBeenCalledWith("https://mastodon.social/api/v1/accounts/1/statuses");
  });

  it("should throw UnauthorizedError on unauthorized response", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    vi.mocked(fetchMastodonAccount).mockResolvedValueOnce(accountSample);

    await expect(
      fetchMastodonStatus({
        options: { username: "testuser" },
        env: {},
        pageConfig: {},
        oauth: null,
      } as any),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("should throw error on invalid response data", async () => {
    const invalidResponse = [{ invalid: "data" }];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(invalidResponse),
    });

    await expect(
      fetchMastodonStatus({
        options: { username: "testuser" },
        env: {},
        pageConfig: {},
        oauth: null,
      } as any),
    ).rejects.toThrow();
  });
});
