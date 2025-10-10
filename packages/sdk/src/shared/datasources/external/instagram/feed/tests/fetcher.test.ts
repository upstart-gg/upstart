import { describe, it, expect, vi, beforeEach } from "vitest";
import fetchInstagramFeedDatasource from "../fetcher";
import { UnauthorizedError } from "~/shared/datasources/errors";

// Mock the fetch function
global.fetch = vi.fn();

describe("fetchInstagramFeedDatasource", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch Instagram feed successfully", async () => {
    const mockResponse = {
      data: [
        {
          id: "123",
          caption: "Test post",
          media_url: "https://example.com/image.jpg",
          permalink: "https://instagram.com/p/123",
          media_type: "IMAGE",
          timestamp: "2023-05-01T12:00:00+0000",
        },
      ],
      paging: {
        cursors: { before: "before-cursor", after: "after-cursor" },
        next: "https://example.com/next",
      },
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fetchInstagramFeedDatasource({
      options: { limit: 10 },
      oauth: { config: { accessToken: "test-token" } },
      env: {},
      pageConfig: {},
    } as any);

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("https://graph.instagram.com/me/media?"),
    );
  });

  it("should throw Http401Error on unauthorized response", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    await expect(
      fetchInstagramFeedDatasource({
        options: { limit: 10 },
        oauth: { config: { accessToken: "invalid-token" } },
        env: {},
        pageConfig: {},
      } as any),
    ).rejects.toThrow(UnauthorizedError);
  });
});
