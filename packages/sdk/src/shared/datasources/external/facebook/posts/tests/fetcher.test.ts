import { describe, it, expect, vi, beforeEach } from "vitest";
import fetchFacebookPostDatasource from "../fetcher";
import { UnauthorizedError } from "~/shared/datasources/errors";
import type { MetaOAuthConfig } from "~/shared/datasources/external/meta/oauth/config";
import type { MetaOptions } from "~/shared/datasources/external/meta/options";
import type { DatasourceFetcherParams } from "~/shared/datasources/fetcher";

// Mock the fetch function
global.fetch = vi.fn();

describe("fetchFacebookPostDatasource", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch Facebook posts successfully", async () => {
    const mockResponse = {
      data: [
        {
          object_id: "123",
          id: "123",
          message: "Test post",
          from: { name: "Test User", id: "456" },
          permalink_url: "https://facebook.com/post/123",
          link: "https://facebook.com/post/123",
          is_hidden: false,
          is_published: true,
          type: "status",
          status_type: "mobile_status_update",
          actions: [{ name: "Comment", link: "https://facebook.com/post/123" }],
        },
      ],
      paging: { next: "https://graph.facebook.com/me/posts?after=123" },
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    // @ts-ignore
    const result = await fetchFacebookPostDatasource({
      options: { limit: 10 },
      oauth: { config: { accessToken: "test-token" } },
      // @ts-ignore
      pageAttributes: {
        id: "me",
        siteId: "123",
      },
    } as DatasourceFetcherParams<MetaOAuthConfig, MetaOptions>);

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("https://graph.facebook.com/me/posts?"),
    );
  });

  it("should throw UnauthorizedError on unauthorized response", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    await expect(
      // @ts-ignore
      fetchFacebookPostDatasource({
        options: { limit: 10 },
        oauth: { config: { accessToken: "invalid-token" } },
        pageAttributes: {},
      } as DatasourceFetcherParams<MetaOAuthConfig, MetaOptions>),
    ).rejects.toThrow(UnauthorizedError);
  });
});
