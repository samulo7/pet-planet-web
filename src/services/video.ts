// ✅ 1. 修改引用路径：确保指向 src/utils/request.ts
// 如果你的 request 文件确实在 services 目录下，请改为 import request from '@/services/request';
import request from '@/utils/request'; 

// ✅ 2. 加上 'type' 关键字：解决 verbatimModuleSyntax 报错
import type { Video } from '@/types/entity';
import type { PaginatedData } from '@/types/api';

export const videoAPI = {
  // 获取视频列表
  getVideoList: (params: any) => 
    request.get<PaginatedData<Video>>('/videos', { params }), // 注意：get 的第二个参数才是 config，params 要包一层

  // 获取我的视频列表
  getMyVideos: (params: { page: number; page_size: number }) => 
    request.get<PaginatedData<Video>>('/videos/my', { params }),

  // 获取视频详情
  getVideoDetail: (id: number | string) => 
    request.get<Video>(`/videos/${id}`),

  // 上传视频文件
  uploadVideo: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request.post<Video>('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 600000, 
    });
  },

  // 发布视频
  publishVideo: (id: number | string, data: { title: string; description: string }) => 
    request.post('/videos/publish', { id, video_id: id, ...data }),

  // 删除视频
  deleteVideo: (id: number | string) => 
    request.delete(`/videos/${id}`),

  // 记录播放
  recordView: (id: number | string, data: { duration: number; completed: boolean }) => 
    request.post(`/videos/${id}/view`, data),
    
  // 点赞/取消点赞
  toggleLike: (id: number | string, isLiked: boolean) => {
    return isLiked 
      ? request.delete(`/videos/${id}/like`) 
      : request.post(`/videos/${id}/like`);
  }
};
