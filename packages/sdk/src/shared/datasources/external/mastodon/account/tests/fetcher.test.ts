import { describe, it, expect, vi, beforeEach } from "vitest";
import fetchMastodonAccount from "../fetcher";
import { sample } from "../sample";

// Mock the fetch function
global.fetch = vi.fn();

describe("fetchMastodonAccount", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch Mastodon account successfully", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(sample),
    });

    const result = await fetchMastodonAccount({
      options: { username: "testuser" },
      env: {},
      pageConfig: {},
      oauth: null,
    } as any);

    expect(result).toEqual(sample);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("https://mastodon.social/api/v1/accounts/lookup?acct=testuser"),
    );
  });

  it("should throw error on non-OK response", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(
      fetchMastodonAccount({
        options: { username: "nonexistent" },
        env: {},
        pageConfig: {},
        oauth: null,
      } as any),
    ).rejects.toThrow("fetchMastodonAccount Error: Response status: 404");
  });
});
