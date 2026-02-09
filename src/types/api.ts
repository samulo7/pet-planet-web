// src/types/api.ts

// 1. 通用响应结构 (对应 Go 的 Response 结构体)
export interface ApiResponse<T = any> {
    code: number;
    message: string;
    data: T;
  }
  
  // 2. 分页数据结构 (对应 Go 的 SuccessWithPagination)
  export interface PaginatedData<T> {
    list: T[];
    total: number;
    page: number;
    page_size: number;
  }