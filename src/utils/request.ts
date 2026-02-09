import axios, { 
  type AxiosInstance, 
  type AxiosError, 
  type AxiosResponse, 
  type InternalAxiosRequestConfig 
} from 'axios';

// 定义接口返回格式
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// --- 🔒 防止多次弹出 401 提示 ---
let isLoggingOut = false;

const showMessage = (msg: string) => {
  // 这里可以换成 Antd 的 message.error(msg)
  console.log(`[Message] ${msg}`);
  alert(msg); // 暂时用 alert，建议换成 UI 库的 Toast
};

/**
 * 核心修改：处理登出逻辑
 * 不再发送 CustomEvent，而是直接调用 Store 方法
 */
const handleLogout = (msg = '登录已过期，请重新登录') => {
  if (isLoggingOut) return;
  isLoggingOut = true;

  console.warn('🔒 [Logout] 触发登出:', msg);
  
  // 1. 提示用户
  showMessage(msg);

  // 2. 动态导入 Store (避免循环依赖: request -> store -> request)
  // 确保路径正确，如果是 alias 路径请用 '@/store/useAuthStore'
  import('../store/useAuthStore').then(({ useAuthStore }) => {
    // ✅ 直接获取 Store 的方法
    const { logout, openLoginModal } = useAuthStore.getState();

    // ✅ A. 执行登出 (Store 内部会自动清理 localStorage 和 token 状态)
    // 你不需要在这里手动 removeItem，Store 的 logout 动作里已经写了
    logout();

    // ✅ B. 直接打开登录弹窗
    openLoginModal();

    // ✅ C. 重置锁
    setTimeout(() => {
      isLoggingOut = false;
    }, 1000); // 1秒冷却，避免连点
  }).catch((err) => {
    console.error('无法加载 AuthStore:', err);
    isLoggingOut = false;
  });
};

// --- 🟢 请求拦截器 (保持不变) ---
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// --- 🔵 响应拦截器 (保持不变) ---
request.interceptors.response.use(
  (response: AxiosResponse<any>) => {
    const rawData = response.data;

    // 1. 非 JSON 防御
    if (typeof rawData !== 'object' || rawData === null) {
      return Promise.reject(new Error('网络请求错误：未收到 JSON'));
    }

    // 2. 兼容无 code 模式
    if (typeof rawData.code === 'undefined') {
      return rawData;
    }

    // 3. 标准模式
    const res = rawData as ApiResponse;
    if (res.code === 200) {
      return res.data;
    }
    
    // 4. 处理业务错误 (401)
    if (res.code === 401) {
      handleLogout(res.message || '登录已过期');
      return Promise.reject(new Error(res.message || '未授权'));
    }

    return Promise.reject(new Error(res.message || '系统错误'));
  },
  (error: AxiosError) => {
    // 处理 HTTP 状态码 401
    if (error.response?.status === 401) {
      const data = error.response.data as any;
      handleLogout(data?.message || '登录已过期，请重新登录');
    }
    return Promise.reject(error);
  }
);

export default request;