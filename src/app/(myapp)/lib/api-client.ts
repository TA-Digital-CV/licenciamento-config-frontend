/**
 * HTTP Client utility for backend API calls
 * Base URL: http://localhost:8083
 */

const API_BASE_URL = 'http://localhost:8083/api/v1';

export interface ApiResponse<T> {
  content: T[];
  total: number;
  page?: number;
  size?: number;
}

export interface ApiError {
  message: string;
  status: number;
  body?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorBody = '';
        try {
          errorBody = await response.text();
        } catch {}
        const err: ApiError = {
          message: `HTTP ${response.status}: ${response.statusText}${errorBody ? ` - ${errorBody}` : ''}`,
          status: response.status,
          body: errorBody,
        };
        console.error(`API request failed: ${url}`, err);
        throw err as unknown as Error;
      }

      // Handle empty responses safely (e.g., 204 No Content)
      if (response.status === 204) {
        return undefined as unknown as T;
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return undefined as unknown as T;
      }

      // Safe JSON parse
      try {
        const data = (await response.json()) as T;
        return data;
      } catch {
        // If body is empty or invalid JSON, return undefined to avoid breaking callers
        return undefined as unknown as T;
      }
    } catch (error) {
      // Errors already logged above; just rethrow
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
    let url = endpoint;
    if (params) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined) continue;
        searchParams.set(key, String(value));
      }
      const qs = searchParams.toString();
      if (qs) url += `?${qs}`;
    }
    return this.request<T>(url, { method: 'GET' });
  }

  // POST request
  async post<T, B = unknown>(endpoint: string, data: B): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data as unknown),
    });
  }

  // PUT request
  async put<T, B = unknown>(endpoint: string, data: B): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data as unknown),
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // PATCH request
  async patch<T, B = unknown>(endpoint: string, data?: B): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data !== undefined ? JSON.stringify(data as unknown) : undefined,
    });
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Types have been moved to specific type files in src/app/(myapp)/types/
// Import them from there when needed
