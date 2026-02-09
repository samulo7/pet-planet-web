// src/api/user.ts
import request from '@/utils/request';
import type { User } from '@/types/entity';

export const userAPI = {
  // 获取用户公开资料 (个人主页用)
  getUserProfile: (id: number | string) => 
    request.get<any, User>(`/users/${id}`),

  // 关注用户
  followUser: (id: number | string) => 
    request.post<any, void>(`/users/${id}/follow`),

  // 取消关注
  unfollowUser: (id: number | string) => 
    request.delete<any, void>(`/users/${id}/follow`),
};