import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 🛠️ 定义一个处理登出的通用函数
    const handleUnauthorized = () => {
      console.log('🔒 检测到未登录/Token失效');
      
      // 1. 派发自定义事件，通知 MainLayout 打开登录弹窗
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));

      // 2. 如果当前不在首页，建议跳回首页 (防止停留在需要权限的页面报错)
      //    如果你希望用户留在当前页并弹出登录框，可以把下面这行注释掉
      if (location.pathname !== '/') {
        navigate('/'); 
      }
    };

    // ✅ 1. 监听 localStorage 变化 (多标签页同步)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' && !e.newValue) {
        handleUnauthorized(); // 👈 替换原来的 navigate('/login')
      }
    };

    // ✅ 2. 页面可见性变化时检查 token
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const token = localStorage.getItem('token');
        if (!token) {
          handleUnauthorized(); // 👈 替换原来的 navigate('/login')
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [navigate, location]);

  return <>{children}</>;
};