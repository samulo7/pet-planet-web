import request from '@/utils/request';
import type { PaginatedData } from '@/types/api';
import type { Video, Comment } from '@/types/entity';

// 定义接口返回类型
interface LikeResponse {
  is_liked: boolean;
  message: string;
}

// ✅ 修正：现在这个接口会被 getLikeCount 使用
interface LikeCountResponse {
  like_count: number; 
  video_id: number;
}

// 评论查询参数
interface CommentParams {
  target_type: number;
  target_id: string | number;
  page?: number;
  page_size?: number;
}

// 发表评论参数
interface CreateCommentData {
  target_type: number;
  target_id: number;
  content: string;
  parent_id?: number; 
}


export const videoAPI = {
  // === 视频基础 ===

  // 获取视频列表
  getVideoList: (params: { page: number; page_size: number; category?: string }) => 
    request.get<any, PaginatedData<Video>>('/videos', { params }),

  // 获取我的视频
  getMyVideos: (params: { page: number; page_size: number }) => 
    request.get<any, PaginatedData<Video>>('/videos/my', { params }),

  // 获取视频详情
  getVideoDetail: (id: number | string) => 
    request.get<any, Video>(`/videos/${id}`),

  // 上传视频
  uploadVideo: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request.post<any, Video>('/videos/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 600000, 
    });
  },

  // 发布/更新视频
  publishVideo: (id: number | string, data: { title: string; description: string }) => 
    request.put<any, Video>(`/videos/${id}`, data),

  // 删除视频
  deleteVideo: (id: number | string) => 
    request.delete(`/videos/${id}`),

  // 记录播放
  recordView: (id: number | string, data: { duration: number; completed: boolean }) => 
    request.post(`/videos/${id}/view`, data),

  // === 互动相关 (点赞/评论) ===

  // ✅ [修正] 这里现在使用 LikeCountResponse 类型了
  getLikeCount: (id: number | string) => 
    request.get<any, LikeCountResponse>(`/videos/${id}/like/count`),

  // 点赞/取消点赞
  toggleLike: (id: number | string) => {
    // 统一使用 POST 请求，让后端去判断是“点赞”还是“取消点赞”
    return request.post<any, LikeResponse>(`/videos/${id}/like`);
  },

  // 获取评论
  getVideoComments: (params: CommentParams) => {
    return request.get<any, PaginatedData<Comment>>('/comments', { params });
  },

  // 发表评论
  createComment: (data: CreateCommentData) => {
    return request.post<any, Comment>('/comments', data);
  },
 
};
export const commentAPI = {
  // 点赞/取消点赞评论
  toggleLike: (id: number | string) => 
    request.post<any, { message: string; is_liked: boolean }>(`/comments/${id}/like`),
  
  // 获取评论点赞数
  getLikeCount: (id: number | string) => 
    request.get<any, { comment_id: number; like_count: number }>(`/comments/${id}/like/count`),
};