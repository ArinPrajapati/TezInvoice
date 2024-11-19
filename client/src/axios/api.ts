import axios, {
  AxiosInstance,
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";

interface RequestConfig extends InternalAxiosRequestConfig {
  retryCount?: number;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

interface ErrorResponse {
  message: string;
  code: string;
  details?: any;
}

class ApiClient {
  private client: AxiosInstance;

  constructor(
    private baseURL: string = process.env.API_BASE_URL ||
      "http://localhost:4000/api",
    private timeout: number = 30000
  ) {
    this.client = this.initializeAxios();
  }

  private initializeAxios(): AxiosInstance {
    const client = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    this.setupInterceptors(client);
    return client;
  }

  private setupInterceptors(client: AxiosInstance): void {
    client.interceptors.request.use(
      (config: RequestConfig) => {
        const token = localStorage.getItem("authToken");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        config.params = { ...config.params, _t: new Date().getTime() };
        return config;
      },
      (error: AxiosError) => Promise.reject(this.handleError(error))
    );

    client.interceptors.response.use(
      (response: AxiosResponse) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as RequestConfig;
        if (
          error.message === "Network Error" &&
          originalRequest.retryCount !== 3
        ) {
          originalRequest.retryCount = (originalRequest.retryCount || 0) + 1;
          await new Promise((resolve) =>
            setTimeout(
              resolve,
              1000 * Math.pow(2, originalRequest.retryCount ?? 0)
            )
          ); // Exponential backoff
          return client(originalRequest);
        }

        if (
          error.response?.status === 401 &&
          !originalRequest.url?.includes("refresh")
        ) {
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            try {
              const { data } = await this.post<{ token: string }>(
                "/auth/refresh",
                { refreshToken }
              );
              localStorage.setItem("authToken", data.token);
              originalRequest.headers.Authorization = `Bearer ${data.token}`;
              return client(originalRequest);
            } catch {
              localStorage.removeItem("authToken");
              localStorage.removeItem("refreshToken");
              window.location.href = "/login";
            }
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ErrorResponse {
    if (error.response) {
      return {
        message:
          (error.response.data as any)?.message || "Server error occurred",
        code: String(error.response.status),
        details: error.response.data,
      };
    } else if (error.request) {
      return {
        message: "No response received from server",
        code: "NETWORK_ERROR",
        details: error.request,
      };
    } else {
      return {
        message:
          error.message || "An error occurred while setting up the request",
        code: "REQUEST_SETUP_ERROR",
      };
    }
  }

  private async request<T>(
    config: InternalAxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.request<T>(config);
      return {
        data: response.data,
        status: response.status,
        statusText: response.statusText,
      };
    } catch (error) {
      throw this.handleError(error as AxiosError);
    }
  }

  public async get<T>(url: string, params?: object): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "GET",
      url,
      params,
      headers: {} as AxiosRequestHeaders,
    });
  }

  public async post<T>(url: string, data?: object): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "POST",
      url,
      data,
      headers: {} as AxiosRequestHeaders,
    });
  }

  public async put<T>(url: string, data?: object): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "PUT",
      url,
      data,
      headers: {} as AxiosRequestHeaders,
    });
  }

  public async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>({
      method: "DELETE",
      url,
      headers: {} as AxiosRequestHeaders,
    });
  }

  public async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (percentage: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    return this.request<T>({
      method: "POST",
      url,
      data: formData,
      headers: new axios.AxiosHeaders({ "Content-Type": "multipart/form-data" }),
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentage = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentage);
        }
      },
    });
  }
}

export const api = new ApiClient();
