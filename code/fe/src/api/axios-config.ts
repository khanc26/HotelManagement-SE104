import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { getAccessToken } from "@/utils/helpers/getAccessToken";
import { setAccessToken } from "@/utils/helpers/setAccessToken";

interface FailedRequest {
  resolve: (value: AxiosResponse | Promise<AxiosResponse>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (reason: any) => void;
  config: CustomAxiosRequestConfig;
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: FailedRequest[] = [];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.config.headers = prom.config.headers ?? {};
      prom.config.headers["Authorization"] = `Bearer ${token}`;
      prom.resolve(axios(prom.config));
    }
  });
  failedQueue = [];
};

export const createApiInstance = (baseURL: string): AxiosInstance => {
  const api = axios.create({
    baseURL,
    withCredentials: true,
  });

  api.interceptors.request.use(
    (config) => {
      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers["Authorization"] = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest: CustomAxiosRequestConfig = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          // Queue the request if refresh is in progress
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject, config: originalRequest });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
            {},
            {
              withCredentials: true,
            }
          );

          const newToken = response.data.access_token;

          isRefreshing = false;

          // Update token in storage or wherever you store it
          // Assuming you have a function to set the new token
          setAccessToken(newToken);

          // Update all queued requests with new token
          processQueue(null, newToken);

          // Retry the original request
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          isRefreshing = false;
          processQueue(refreshError);

          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};
