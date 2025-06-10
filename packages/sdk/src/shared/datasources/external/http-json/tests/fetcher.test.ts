import { describe, it, expect, vi, beforeEach } from "vitest";
import fetchHttpJSON from "../fetcher";
import type { HttpJsonOptions } from "../options";
import type { DatasourceFetcherParams } from "~/shared/datasources/fetcher";

// Mock the fetch function
global.fetch = vi.fn();

describe("fetchHttpJSON", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fetch JSON data successfully", async () => {
    const mockResponse = { data: "test" };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fetchHttpJSON({
      options: { url: "https://api.example.com/data" },
      attr: {},
      oauth: null,
    } as DatasourceFetcherParams<null, HttpJsonOptions>);

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith("https://api.example.com/data", { headers: {} });
  });

  it("should replace placeholders in URL and headers", async () => {
    const mockResponse = { data: "test" };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fetchHttpJSON({
      options: {
        url: "https://api.example.com/{{dataType}}",
        headers: { "X-API-Key": "{{apiKey}}" },
      },
      attr: { dataType: "users", apiKey: "secret-key" },
      env: {},
      oauth: null,
    } as unknown as DatasourceFetcherParams<null, HttpJsonOptions>);

    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith("https://api.example.com/users", {
      headers: { "X-API-Key": "secret-key" },
    });
  });

  it("should throw error on non-OK response", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(
      fetchHttpJSON({
        options: { url: "https://api.example.com/notfound" },
        attr: {},
        oauth: null,
      } as DatasourceFetcherParams<null, HttpJsonOptions>),
    ).rejects.toThrow("fetchHttpJSON Error: Response status: 404");
  });
});
