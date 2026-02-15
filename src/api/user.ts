// src/api/user.ts
import request from '@/utils/request';

export const userAPI = {
  // 鑾峰彇鐢ㄦ埛鍏紑璧勬枡 (涓汉涓婚〉鐢?
  getUserProfile: async (id: number | string) => {
    const path = id === 'me' ? '/users/me' : `/users/${id}`;
    const res = await request.get<any, unknown>(path);
    const data = (res as any)?.data;
    if (data && typeof data === 'object') {
      return (data as any)?.data ?? data;
    }
    return (res as any)?.data ?? res;
  },

  // 鍏虫敞鐢ㄦ埛
  followUser: (id: number | string) => 
    request.post<any, void>(`/users/${id}/follow`),

  // 鍙栨秷鍏虫敞
  unfollowUser: (id: number | string) => 
    request.delete<any, void>(`/users/${id}/follow`),
};
