import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

interface ApiResponse<T = unknown> {
  code: number | string;
  message: string;
  data: T;
}

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

let isLoggingOut = false;

const showMessage = (msg: string) => {
  console.log(`[Message] ${msg}`);
  alert(msg);
};

const handleLogout = (msg = '登录已过期，请重新登录') => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  showMessage(msg);

  import('../store/useAuthStore')
    .then(({ useAuthStore }) => {
      const { logout, openLoginModal } = useAuthStore.getState();
      logout();
      openLoginModal();

      setTimeout(() => {
        isLoggingOut = false;
      }, 1000);
    })
    .catch((err) => {
      console.error('failed to load auth store', err);
      isLoggingOut = false;
    });
};

request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

request.interceptors.response.use(
  (response: AxiosResponse<any>): any => {
    const rawData = response.data as any;

    if (typeof rawData !== 'object' || rawData === null) {
      return Promise.reject(new Error('网络请求错误：未收到 JSON'));
    }

    if (!('code' in rawData)) {
      return rawData;
    }

    const res = rawData as ApiResponse;
    if (res.code === 200 || res.code === 0 || res.code === '200' || res.code === '0') {
      return typeof res.data === 'undefined' ? res : res.data;
    }

    if (res.code === 401 || res.code === '401') {
      handleLogout(res.message || '登录已过期，请重新登录');
      return Promise.reject(new Error(res.message || '未授权'));
    }

    return Promise.reject(new Error(res.message || '系统错误'));
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      const data = error.response.data as { message?: string } | undefined;
      handleLogout(data?.message || '登录已过期，请重新登录');
    }
    return Promise.reject(error);
  },
);

export default request;
