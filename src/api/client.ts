import { storage } from "../lib/storage";
import { API_BASE_URL, ENDPOINTS } from "./endpoints";

// interface ApiResponse<T = any> {
// 	success: boolean;
// 	data?: T;
// 	error?: string;
// }

interface ApiError {
  error: string;
  stack?: string;
}

type ApiResponse<T> =
  | { success: true; data: T }
  | ({ success: false } & ApiError);

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T>> {
    const token = storage.getAccessToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      // Handle 401 - token expired
      if (response.status === 401) {
        if (data.code === "TOKEN_EXPIRED") {
          const refreshed = await this.refreshToken();

          if (refreshed) {
            // Retry original request
            return this.request(endpoint, options);
          } else {
            // Redirect to login
            storage.clearTokens();
            storage.clearUser();
            window.location.href = "/login";
          }
        }
      }

      return data;
    } catch (error) {
      console.error("API request error: ", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Network error",
      };
    }
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = storage.getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${this.baseURL}${ENDPOINTS.AUTH.REFRESH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        storage.setTokens(data.data.accessToken, data.data.refreshToken);
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  public async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  public async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  public async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
