// src/types/entity.ts

// ✅ 1. 用户实体 (对应 Go 的 User Struct)
export interface User {
    id: number;
    username: string;
    email?: string;
    phone?: string;
    avatar: string;
    nickname: string;
    bio: string;
    gender: 0 | 1 | 2; // 0:未知 1:男 2:女
    
    
    // 统计数据
    follower_count: number;
    following_count: number;
    video_count: number;
    experience_count: number;
    
    // 状态与信誉
    status: 1 | 2; // 1:正常 2:封禁
    reputation_score: number;      // 信誉分
    level?: number;// 🌟 新增：等级和积分
    verified_order_count: number;  // 已验证订单数
    
    created_at: string;
    updated_at: string;
  }
  
  // ✅ 2. 视频实体 (对应 Go 的 Video Struct)
  export interface Video {
    id: number;
    user_id: number;
    title: string;
    description: string;
    cover_url: string;
    video_url: string;
    transcoded_url: string; // 转码后的地址
    
    // 统计数据
    view_count: number;
    like_count: number;
    comment_count: number;
    collect_count: number; // 对应“收藏”
    
    duration: number;
    width: number;
    height: number;
    
    created_at: string;
    
    // 关联的用户信息 (可能为空，所以用 ?)
    user?: User; 
  
    // ⚠️ 注意：下面的字段通常是 API 额外计算返回的 (DTO)，不是数据库原生的
    // 如果你的 API 还没加这俩字段，前端暂时无法知道“我是否点过赞”
    is_liked?: boolean; 
    is_collected?: boolean;
  }
  
  // ✅ 3. 图片实体 (对应 Go 的 Image Struct)
  export interface PetImage {
    id: number;
    user_id: number;
    title: string;
    description: string;
    image_url: string;
    thumbnail_url: string;
    type: 1 | 2; // 1:用户上传, 2:AI生成
    ai_prompt?: string;
    
    width: number;
    height: number;
    file_size: number;
    
    view_count: number;
    like_count: number;
    comment_count: number;
    
    status: 1 | 2;
    created_at: string;
    
    user?: User;
  }
  
  
  // ✅ 4. 经验贴实体 (占位，防止其他文件引用报错)
  export interface ExperiencePost {
    id: number;
    title: string;
    content: string;
    cover_image: string;
    category: string;
    view_count: number;
    like_count: number;
    created_at: string;
    user?: User;
  }
  // ✅ 5. 分页响应类型 (通用)
export interface PaginatedData<T> {
  list: T[];
  page: number;
  page_size: number;
  total: number;
}

// ✅ 6. 图片接口的特殊响应格式 (因为它多包了一层 data)
export interface ImageResponse {
  data: PaginatedData<PetImage>;
}
export interface Comment {
  id: number;
  user_id: number;
  target_type: number; // 1:视频, 2:图像, 3:经验帖
  target_id: number;
  parent_id: number | null; // 父评论ID
  content: string;
  like_count: number;
  reply_count: number;
  status: number; // 1:正常, 2:删除
  created_at: string;
  updated_at: string;
  is_liked?: boolean;
  
  // 关联数据
  user?: User;
  replies?: Comment[]; // 子评论列表
}