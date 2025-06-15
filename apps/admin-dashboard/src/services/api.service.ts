import { environment, debugLog } from '../config/environment';

class ApiService {
  private readonly baseUrl = environment.apiUrl;

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    debugLog('API Request', { url, method: options.method || 'GET' });

    const token = localStorage.getItem('accessToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers,
      signal: AbortSignal.timeout(environment.apiTimeoutMs),
    };

    try {
      const response = await fetch(url, config);

      debugLog('API Response', {
        url,
        status: response.status,
        statusText: response.statusText,
      });

      // Handle different response scenarios
      if (response.status === 401) {
        debugLog('Unauthorized - attempting token refresh');
        await this.refreshToken();

        // Retry the original request
        const newToken = localStorage.getItem('accessToken');
        if (newToken) {
          // Create a new headers object for the retry to ensure type safety
          const retryHeaders: Record<string, string> = {
            ...(config.headers as Record<string, string>),
            Authorization: `Bearer ${newToken}`,
          };
          const retryResponse = await fetch(url, {
            ...config,
            headers: retryHeaders,
          });

          if (!retryResponse.ok) {
            throw await this.createErrorFromResponse(retryResponse);
          }

          return await this.parseResponse<T>(retryResponse);
        }
      }

      if (!response.ok) {
        throw await this.createErrorFromResponse(response);
      }

      return await this.parseResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout - please check your connection');
      }

      debugLog('API Error', error);
      throw error;
    }
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      return await response.json();
    }

    // Handle text responses
    if (contentType?.includes('text/')) {
      return (await response.text()) as T;
    }

    // Handle empty responses
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  }

  private async createErrorFromResponse(response: Response): Promise<Error> {
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

    try {
      const errorData = await response.json();

      // Handle .NET API error responses
      if (errorData.title) {
        errorMessage = errorData.title;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.errors) {
        // Handle validation errors
        const validationErrors = Object.values(errorData.errors).flat();
        errorMessage = validationErrors.join(', ');
      }

      debugLog('Error Details', errorData);
    } catch (parseError) {
      debugLog('Could not parse error response', parseError);
    }

    return new Error(errorMessage);
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);

      debugLog('Token refreshed successfully');
    } catch (error) {
      debugLog('Token refresh failed', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }

      throw error;
    }
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.get('/health');
      return true;
    } catch (error) {
      debugLog('Health check failed', error);
      return false;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, data?: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const token = localStorage.getItem('accessToken');
    const headers: Record<string, string> = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const formDataKeys: string[] = [];
    for (const key of (formData as any).keys()) {
      formDataKeys.push(key);
    }
    debugLog('File Upload', { endpoint, formData: formDataKeys });

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
      signal: AbortSignal.timeout(environment.apiTimeoutMs * 2),
    });

    if (!response.ok) {
      throw await this.createErrorFromResponse(response);
    }

    return await this.parseResponse<T>(response);
  }

  getFileUrl(fileId: number, token?: string): string {
    const baseUrl = `${this.baseUrl}/file/${fileId}/download`;
    return token ? `${baseUrl}?token=${token}` : baseUrl;
  }

  getThumbnailUrl(fileId: number): string {
    return `${this.baseUrl}/file/${fileId}/thumbnail`;
  }

  // Helper method to test API connectivity
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const isHealthy = await this.healthCheck();
      return {
        success: isHealthy,
        message: isHealthy
          ? 'API connection successful'
          : 'API health check failed',
      };
    } catch (error) {
      return {
        success: false,
        message:
          error instanceof Error ? error.message : 'Unknown connection error',
      };
    }
  }
}

export const apiService = new ApiService();
