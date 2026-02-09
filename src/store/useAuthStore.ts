import { create } from 'zustand';
import type { User } from '@/types/entity'; 

// 👇 这里就是报错的原因！你之前的 interface 少了下面带 ✅ 的这几行
interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;

  // ✅ 1. 补上：状态定义
  isLoginModalOpen: boolean;

  // Actions
  login: (token: string, user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;

  // ✅ 2. 补上：方法定义
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // 初始化
  token: localStorage.getItem('token'),
  user: localStorage.getItem('user_info') ? JSON.parse(localStorage.getItem('user_info')!) : null,
  isAuthenticated: !!localStorage.getItem('token'),
  
  // ✅ 实现状态初始化
  isLoginModalOpen: false,

  // 登录动作
  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user_info', JSON.stringify(user));
    // 登录成功自动关闭弹窗
    set({ token, user, isAuthenticated: true, isLoginModalOpen: false });
  },

  // 退出动作
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_info');
    set({ token: null, user: null, isAuthenticated: false });
  },

  // 更新用户
  updateUser: (updatedFields) => {
    set((state) => {
      if (!state.user) return state;
      const newUser = { ...state.user, ...updatedFields };
      localStorage.setItem('user_info', JSON.stringify(newUser));
      return { user: newUser };
    });
  },

  // ✅ 实现打开/关闭方法
  openLoginModal: () => set({ isLoginModalOpen: true }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),
}));