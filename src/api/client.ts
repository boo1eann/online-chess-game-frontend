import { storage } from "../lib/storage";
import { API_BASE_URL, ENDPOINTS } from "./endpoints";

interface ApiError {
  error: string;
  errorCode?: string;
}

type ApiResponse<T> =
  | { success: true; data: T }
  | ({ success: false } & ApiError);

class ApiClient {
  private baseURL: string;
  private isRefreshing = false;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private forceLogout(): never {
    storage.clearTokens();
    storage.clearUser();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  private async safeJson(response: Response): Promise<any | null> {
    try {
      return await response.json();
    } catch {
      return null;
    }
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

      const data = await this.safeJson(response);

      // Handle 401 - token expired
      if (response.status === 401) {
        if (data?.errorCode === "ACCESS_TOKEN_EXPIRED") {
          if (this.isRefreshing) {
            return data;
          }

          this.isRefreshing = true;
          const refreshed = await this.refreshToken();
          this.isRefreshing = false;

          if (refreshed) {
            return this.request(endpoint, options);
          }

          this.forceLogout();
        }

        this.forceLogout();
      }

      // ---- 409 Conflict (business logic) ----
      if (response.status === 409) {
        return data;
      }

      if (!response.ok) {
        return data;
      }

      return data;
    } catch (error) {
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
