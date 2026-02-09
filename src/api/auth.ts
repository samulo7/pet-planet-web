import request from '@/utils/request';
import type { User } from '@/types/entity';

// ✅ 1. 直接在这里定义参数类型，不再依赖 src/services/auth
export interface LoginParams {
  username: string;
  password: string;
}

export interface RegisterParams {
  username: string;
  password: string;
  email?: string;
  phone?: string;
}

// ✅ 2. 定义登录/注册的响应结构
interface AuthResponse {
  user: User;
  token: string;
}

export const authAPI = {
  // 注册
  register: (data: RegisterParams) => 
    request.post<any, AuthResponse>('/auth/register', data),

  // 登录
  login: (data: LoginParams) => 
    request.post<any, AuthResponse>('/auth/login', data),

  // 获取当前用户信息
  getCurrentUser: () => 
    request.get<any, User>('/users/me'),

  // 更新个人信息
  updateProfile: (data: Partial<User>) => 
    request.put('/users/me', data),

  // 上传头像
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return request.post<{ avatar_url: string }>('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};