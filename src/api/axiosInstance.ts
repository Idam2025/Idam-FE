import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://your-api-url.com",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) prom.resolve(token);
    else prom.reject(error);
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const userId = localStorage.getItem("userId");
      const deviceId = localStorage.getItem("deviceId");

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (typeof token === "string") {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          }
          return Promise.reject(new Error("Invalid token type"));
        });
      }
      if (
        error.response?.status === 401 &&
        originalRequest.url.includes("/api/refresh")
      ) {
        localStorage.removeItem("accessToken");
        window.location.href = "/join";
      }

      isRefreshing = true;

      try {
        const res = await axiosInstance.get(
          `/api/refresh?userId=${userId}&deviceId=${deviceId}`
        );
        const newToken = res.data.accessToken;

        localStorage.setItem("accessToken", newToken);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newToken}`;
        processQueue(null, newToken);

        originalRequest.headers["Authorization"] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
