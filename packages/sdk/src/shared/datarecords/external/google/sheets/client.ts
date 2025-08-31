interface ApiResponse<T> {
  success: boolean;
  data: T;
  status: number;
  headers: Headers;
}

class GoogleDriveClient {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  async callDriveApi<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "PATCH" = "GET",
    body?: unknown,
  ): Promise<ApiResponse<T>> {
    // Handle binary data for uploads
    const isBinaryUpload = body instanceof ArrayBuffer || body instanceof Uint8Array;
    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.accessToken}`,
    };

    if (!isBinaryUpload) {
      headers["Content-Type"] = "application/json";
    } else {
      headers["Content-Type"] = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }

    const response = await fetch(endpoint, {
      method,
      headers,
      body: isBinaryUpload ? (body as BodyInit) : body ? JSON.stringify(body) : undefined,
    });

    // Handle CSV responses
    if (endpoint.includes("export") && endpoint.includes("mimeType=text/csv")) {
      const csvText = await response.text();
      return {
        success: response.ok,
        data: csvText as T,
        status: response.status,
        headers: response.headers,
      };
    }

    // Handle binary responses (like XLSX downloads) - keeping for compatibility
    if (
      endpoint.includes("export") &&
      endpoint.includes("mimeType=application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    ) {
      const arrayBuffer = await response.arrayBuffer();
      return {
        success: response.ok,
        data: arrayBuffer as T,
        status: response.status,
        headers: response.headers,
      };
    }

    // Handle upload responses which might not be JSON
    if (endpoint.includes("upload/") && response.ok) {
      // For successful uploads, try to parse JSON, but fallback gracefully
      try {
        const data = await response.json();
        return {
          success: response.ok,
          data,
          status: response.status,
          headers: response.headers,
        };
      } catch {
        // If JSON parsing fails but response is ok, return success
        return {
          success: true,
          data: { message: "Upload successful" } as T,
          status: response.status,
          headers: response.headers,
        };
      }
    }

    // Handle error responses that might be HTML
    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      if (contentType?.includes("text/html")) {
        const errorText = await response.text();
        return {
          success: false,
          data: { error: "HTML error response", details: errorText.substring(0, 200) } as T,
          status: response.status,
          headers: response.headers,
        };
      }
    }

    const data = await response.json();

    return {
      success: response.ok,
      data,
      status: response.status,
      headers: response.headers,
    };
  }
}

export default function getClient(accessToken: string): GoogleDriveClient {
  return new GoogleDriveClient(accessToken);
}
