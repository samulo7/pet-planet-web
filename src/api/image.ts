import request from '@/utils/request';
import type { PetImage } from '@/types/entity';
import type { PaginatedData } from '@/types/api';

// ✅ 定义图片接口的特殊响应格式 (多一层 data)
interface ImageListResponse {
  data: PaginatedData<PetImage>;
}

export const imageAPI = {
  // ✅ 获取图片列表 - 修改这里
  getImageList: async (params: { page: number; page_size: number; type?: number; user_id?: string | number }) => {
    const response = await request.get<any, ImageListResponse>('/images', { params });
    // 提取 data 层,返回标准的 PaginatedData 格式
    return response.data;
  },

  // 获取图片详情
  getImageDetail: (id: number | string) => 
    request.get<any, PetImage>(`/images/${id}`),

  // 上传图片
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return request.post<any, PetImage>('/images/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  // AI 生成图片
  generateAIImage: (prompt: string) => 
    request.post<any, { image_url: string; prompt: string }>('/images/ai-generate', { prompt }),
    
  // 点赞图片
  toggleLike: (id: number | string, isLiked: boolean) => {
    return isLiked 
      ? request.delete(`/images/${id}/like`) 
      : request.post(`/images/${id}/like`);
  }
};