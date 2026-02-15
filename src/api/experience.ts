import request from '@/utils/request';
import type { ExperiencePost } from '@/types/entity';
import type { PaginatedData } from '@/types/api';

export interface ExperienceListParams {
  page?: number;
  page_size?: number;
  user_id?: number | string;
  category?: string;
  tag?: string;
}

export interface CreateExperiencePayload {
  title: string;
  content: string;
  cover_image?: string;
  category?: string;
  tags?: string[];
  media_ids?: number[];
  media_urls?: string[];
  catfood_ids?: number[];
  order_image_ids?: number[];
}

export interface UpdateExperiencePayload {
  title?: string;
  content?: string;
  cover_image?: string;
  category?: string;
  tags?: string[];
}

export const experienceAPI = {
  getExperienceList: (params: ExperienceListParams) =>
    request.get<any, PaginatedData<ExperiencePost>>('/experiences', { params }),

  getExperienceDetail: (id: number | string) =>
    request.get<any, ExperiencePost>(`/experiences/${id}`),

  getCategories: () => request.get<any, string[]>('/experiences/categories'),

  getPopularTags: (limit = 20) =>
    request.get<any, string[]>('/experiences/tags', { params: { limit } }),

  createExperience: (payload: CreateExperiencePayload) =>
    request.post<any, ExperiencePost>('/experiences', payload),

  updateExperience: (id: number | string, payload: UpdateExperiencePayload) =>
    request.put<any, void>(`/experiences/${id}`, payload),

  deleteExperience: (id: number | string) =>
    request.delete<any, void>(`/experiences/${id}`),
};
